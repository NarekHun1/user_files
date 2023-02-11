const express = require('express')
const router = express.Router()


router.use('/', require('./auth.routes'))
router.use('/files', require('./file.routes'))


module.exports = router;