const express = require('express')
const router = express.Router()
const {authJwt, getSingleFileBufferFromMultipart, getContentInfo} = require("../middleware");
const {fileController: controller} = require('../controllers');


router.post(
    '/upload',
    authJwt.verifyToken,
    getSingleFileBufferFromMultipart('file'),
    getContentInfo,
    controller.uploadFile
)

router.delete(
    '/delete/:id',
    authJwt.verifyToken,
    controller.deleteFile
)

router.get(
    '/by-id/:id',
    authJwt.verifyToken,
    controller.getFileInfo
)

router.get(
    '/list',
    authJwt.verifyToken,
    controller.getFilesList
)

router.get(
    '/download/:id',
    authJwt.verifyToken,
    controller.downloadFile
)

router.put(
    '/update/:id',
    authJwt.verifyToken,
    getSingleFileBufferFromMultipart('file'),
    getContentInfo,
    controller.updateFile
)


module.exports = router


/*
o /file/list [GET] выводит список файлов и их параметров из базы с
использованием пагинации с размером страницы, указанного в
передаваемом параметре list_size, по умолчанию 10 записей на страницу,
если параметр пустой. Номер страницы указан в параметре page, по
умолчанию 1, если не задан;
 */