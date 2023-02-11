const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const {user: User} = require("../models");
const bcrypt = require("bcryptjs");

const generateAccessAndRefreshTokens = (user) => {
    return {
        accessToken: jwt.sign({id: user.id, type: "accessToken"}, config.secret, {
            expiresIn: 86400 // 24 hours
        }),
        refreshToken: jwt.sign({id: user.id, type: "refreshToken"}, config.secret, {
            expiresIn: 8640 // 24 hours
        })
    }
}

const signInAndSignUpDataValidation = (body) => {
    const {password, email, phoneNumber} = body;
    if (!(email || phoneNumber) || !password) throw new Error('Input data is missing');
    return  {password, email, phoneNumber}
}

const signUp = async (body) => {
    const {password, email, phoneNumber} = signInAndSignUpDataValidation(body);

    const newUser = await User.create({
        identifier: phoneNumber || email,
        password: bcrypt.hashSync(password, 8)
    })
    const tokens = generateAccessAndRefreshTokens(newUser)
    await User.update({...tokens}, {where: {id: newUser.id}})

    await newUser.save();
    return tokens;
}


const signIn = async (body) => {
    const {password, email, phoneNumber} = signInAndSignUpDataValidation(body);

    const user = await User.findOne({
        where: {
            identifier: phoneNumber || email,
        }
    })
    if (!user) {
        throw new Error("User Not found.");
    }

    const passwordIsValid = bcrypt.compareSync(
        password,
        user.password
    );

    if (!passwordIsValid) {
        throw new Error("Invalid Password!");
    }

    const tokens = generateAccessAndRefreshTokens(user)

    await User.update({...tokens}, {where: {id: user.id}})
    return tokens;
}

const refreshTokens = async (userId, refreshToken) => {
    const user = await User.findOne({
        where: {
            id: userId,
            refreshToken: refreshToken
        }
    })

    if (!user) throw new Error("User Not found.");

    const tokens = generateAccessAndRefreshTokens(user)
    await User.update({...tokens}, {where: {id: user.id}})
    return tokens;
}

const getUserInfo = async (userId) => {
    const user = await User.findOne({
        where: {
            id: userId,
        }
    })
    return {
        id: user.id,
        identifier: user.identifier,
    }
}

const logOutUser = async (userId) => {
    await User.update({accessToken: null, refreshToken: null}, {where: {id: userId,}})
}

module.exports = {
    signUp,
    signIn,
    logOutUser,
    getUserInfo,
    refreshTokens,
    generateAccessAndRefreshTokens
}