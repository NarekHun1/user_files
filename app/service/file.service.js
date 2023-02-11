const {extname, normalize} = require("path");
const {unlinkSync, writeFileSync, existsSync, mkdirSync, readFileSync} = require("fs");
const {nanoid} = require('nanoid')
const {file: FileModel} = require("../models");


const storageLocation = 'files'

const fileNameGenerator = (ext) => {
    return `${nanoid(10)}.${ext}`
}

const getFileNameExt = (filename) => {
    return extname(filename)
}

const addFileToStorage = async ({originalName, extension, dataInBuffer}) => {
    try {
        if (!existsSync(storageLocation)) mkdirSync(storageLocation)
    } catch (e) {
        console.log(e.message)
    }
    if (!Buffer.isBuffer(dataInBuffer))
        dataInBuffer = new Buffer.from(dataInBuffer)

    const fullPath = `${storageLocation}/${originalName}`
    writeFileSync(fullPath, dataInBuffer)
    return {originalName, fullPath}
}

const removeFile = async (fileName) => {
    const fileLocation = `${storageLocation}/${fileName}`
    try {
        unlinkSync(normalize(fileLocation))
    } catch (e) {
        console.log(`${fileLocation} wasn't removed bcs of ${e.message}`)
    }
}


const uploadFile = async ({
                              id: userId,
                              originalname: originalName,
                              buffer,
                              ext: extension,
                              size,
                              mimetype: mimeType
                          }) => {
    await addFileToStorage({
        originalName,
        dataInBuffer: buffer,
        extension
    });
    await FileModel.create({
        size,
        originalName,
        mimeType,
        extension,
        userId,
        createdAt: new Date()
    })
}

const updateFile = async ({
                              id: userId,
                              originalname: originalName,
                              buffer,
                              ext: extension,
                              size,
                              mimetype: mimeType,
                              fileId
                          }) => {
    const file = await getUserFileOrThrowError(userId, fileId)
    await removeFile(file.originalName);

    await addFileToStorage({
        originalName,
        dataInBuffer: buffer,
        extension
    });
    await FileModel.update({
        size,
        originalName,
        mimeType,
        extension,
        createdAt: new Date(),
        updatedAt: new Date(),
    }, {
        where: {
            id: fileId
        }
    })
}

const getUserFileOrThrowError = async (userId, fileId) => {
    const file = await FileModel.findOne({
        where: {
            id: fileId,
            userId
        }
    });
    if (!file) {
        const err =  new Error('File dont exists');
        err.responseData = {message: "File dont exists"}
        err.statusCode = 422;
        throw err
    }
    return file
}

const deleteFile = async (userId, fileId) => {
    const file = await getUserFileOrThrowError(userId, fileId)
    await Promise.all([
        removeFile(file.originalName),
        await FileModel.destroy({
            where: {
                id: fileId
            }
        })])
}

const getFileInfo = async (userId, fileId) => {
    return await getUserFileOrThrowError(userId, fileId)
}

const getFilesList = async (userId,limit , offset ) => {
    return FileModel.findAll({
        where: {
            userId
        },
        limit,
        offset,
    });
}

const downloadFile = async (userId, fileId) => {
    const file = await getUserFileOrThrowError(userId, fileId)
    return {
        extension: file.extension, file: readFileSync(`${storageLocation}/${file.originalName}`)
    }
}


module.exports = {
    uploadFile,
    deleteFile,
    getFileInfo,
    downloadFile,
    updateFile,
    getFilesList
}