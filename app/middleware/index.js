const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const multer = require('multer')
const upload = multer()
const FileType = require('file-type')

const getSingleFileBufferFromMultipart = (fileKey) => upload.single(fileKey)

const getContentInfo = async (req, res, next) => {
    try {
        const {file} = req
        if (!file)
            throw new Error(
                'File is missing',
            )

        if (file) {
            const {buffer, size} = file
            const result = await FileType.fromBuffer(buffer)
            const {ext, mime} = result || {ext: file.mimetype, mime: file.mimetype}
            req.file = {ext, mime, size, ...file}
        }

        next()
    } catch (err) {
        return next(err)
    }
}
const notFound = (req, res, next) => {
    const err = new Error('Not Found');
    err.responseData = {message: "Not Found"}
    err.statusCode = 404;
    return next()
}
const errorHandler = (err, req, res, next) => {
    console.log(err)
    const error = err.responseData || {message: "Internal Error"}
    const {statusCode = 400} = error

    res.status(statusCode)
    res.json({
        error,
    })
}

module.exports = {
    authJwt,
    verifySignUp,
    notFound,
    errorHandler,
    getContentInfo,
    getSingleFileBufferFromMultipart
};
