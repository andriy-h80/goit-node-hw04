const {User} = require("../models/user");

const {HttpError, ctrlWrapper} = require("../helpers");

const register = async(req, res) => {
    const newUser = await User.create(req.boby);
    res.status(201).json({
        "user": {
            "email": newUser.email,
            "subscription": "starter"
        }
    });   
};

const login = async(req, res) => {

};

module.exports = {
    register: ctrlWrapper(register),
    // login: ctrlWrapper(login),
};
