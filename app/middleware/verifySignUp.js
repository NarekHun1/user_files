const db = require("../models");
// const ROLES = db.ROLES;
const User = db.user;

checkDuplicatePhoneOrEmail = async (req, res, next) => {
    // phoneNumber
    if (req.body.phoneNumber) {
        const phoneNumberExists = await User.findOne({
            where: {
                identifier: req.body.phoneNumber
            }
        })
        if (phoneNumberExists) {
            res.status(400).send({
                message: "Failed! phoneNumber is already in use!"
            });
            return;
        }
    }
    // Email
    if (req.body.email) {
        console.log(await User.findAll())
        const emailExists = await User.findOne({
            where: {
                identifier: req.body.email
            }
        })
        if (emailExists) {
            res.status(400).send({
                message: "Failed! Email is already in use!"
            });
            return;
        }
    }

    next();

}
;


const verifySignUp = {
    checkDuplicatePhoneOrEmail: checkDuplicatePhoneOrEmail,
};

module.exports = verifySignUp;
