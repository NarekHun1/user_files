const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const {user: User} = require("../models");

const ignoreJWTExpiration = (req, res, next) => {
    req.customData = {
        ignoreJWTExpiration: true
    }
    next()
}

const verifyToken = async (req, res, next) => {
    let token = null
    if ( req.headers.authorization &&  req.headers.authorization.startsWith('Bearer ')) {
        token =  req.headers.authorization.substring(7,  req.headers.authorization.length)
    }

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    const decoded = jwt.verify(token, config.secret, {ignoreExpiration: (req.customData || {}).ignoreJWTExpiration || false})
    const user = await User.findOne({
        where: {
            id: decoded.id,
            accessToken: token,
        }
    })

    if (!user) {
        return res.status(403).send({
            message: "token is wrong!"
        });
    }

    req.userId = decoded.id;
    next();
};

const authJwt = {
    verifyToken,
    ignoreJWTExpiration,
};
module.exports = authJwt;
