const {fileService} = require("../service");

const uploadFile = async (req, res, next) => {
    try {
        await fileService.uploadFile({id: req.userId, ...req.file})
        res.sendStatus(201)
    } catch (e) {
        next(e)
    }
}

const updateFile = async (req, res, next) => {
    try {
        await fileService.updateFile({fileId: req.params.id, id: req.userId, ...req.file})
        res.sendStatus(201)
    } catch (e) {
        next(e)
    }
}

const deleteFile = async (req, res, next) => {
    try {
        await fileService.deleteFile(req.userId, req.params.id);
        res.sendStatus(201)
    } catch (e) {
        next(e)
    }
}

const getFileInfo = async (req, res, next) => {
    try {
        const info = await fileService.getFileInfo(req.userId, req.params.id);
        res.json(info)
    } catch (e) {
        next(e)
    }
}


const getFilesList = async (req, res, next) => {
    try {
        const {list_size = '10', page = '0'} = req.query;
        const filesList = await fileService.getFilesList(req.userId, parseInt(list_size), parseInt(page));
        res.json(filesList)
    } catch (e) {
        next(e)
    }
}

const downloadFile = async (req, res, next) => {
    try {
        const {extension, file} = await fileService.downloadFile(req.userId, req.params.id);
        res.type(extension).send(file)

    } catch (e) {
        next(e)
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
