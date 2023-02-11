const express = require('express')
const router = express.Router()
const {verifySignUp, authJwt} = require('../middleware');
const {authController: controller} = require('../controllers');


router.get('/', (req, res) => {
    res.json({message: 'Welcome to application.'});
});
router.post('/signup', verifySignUp.checkDuplicatePhoneOrEmail, controller.signUp);
router.post('/signin', controller.signIn);
router.get('/logout', authJwt.verifyToken, controller.logOut);
router.get('/info', authJwt.verifyToken, controller.info);
router.post('/signin/new_token', authJwt.ignoreJWTExpiration, authJwt.verifyToken, controller.refreshToken);

module.exports = router