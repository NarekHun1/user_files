const {authService} = require("../service");

const signUp = async (req, res, next) => {
    try {
        const tokens = await authService.signUp(req.body)
        res.json(tokens)
    } catch (err) {
        next(err)
    }
};

const signIn = async (req, res, next) => {
    try {
        const tokens = await authService.signIn(req.body)
        res.status(200).send(tokens);
    } catch (err) {
        next(err)
    }

};

const refreshToken = async (req, res, next) => {
    try {
        const tokens = await authService.refreshTokens(req.userId, req.body.refreshToken);
        res.status(200).send(tokens);
    } catch (err) {
        next(err)
    }
}

const info = async (req, res, next) => {
    try {
        const userInfo = await authService.getUserInfo(req.userId)

        res.status(200).send(userInfo);
    } catch (err) {
        next(err)
    }
}


const logOut = async (req, res, next) => {
    try {
        await authService.logOutUser(req.userId)
        res.status(200).send('Logout!');
    } catch (err) {
        next(err)
    }
}


module.exports = {
    signUp,
    signIn,
    logOut,
    refreshToken,
    info,
}