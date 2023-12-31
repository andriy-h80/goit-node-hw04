const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {User} = require("../models/user");

const {HttpError, ctrlWrapper} = require("../helpers");

const {SECRET_KEY} = process.env;

const register = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(user) {
       throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({email, password: hashPassword});

    res.status(201).json({
        "user": {
            "email": newUser.email,
            "subscription": newUser.subscription,
        }
    });   
};

const login = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token});
    
    res.status(200).json({
        token,
        "user": {
            "email": user.email,
            "subscription": user.subscription,
        }
    }); 
};

const logout = async(req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.status(204).json();
};

const getCurrent = async(req, res) => {
    const {email, subscription} = req.user;

    res.status(200).json({
        email,
        subscription,
    }); 
};

const changeSubscription = async(req, res) => {
    const {subscription} = req.body;
    const {id} = req.user;
    const result = await User.findByIdAndUpdate(id, {subscription}, {new: true});
    if(!result){
        throw HttpError(404, "Not found");
    }

    res.status(200).json({
            subscription,
    }); 
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
    changeSubscription: ctrlWrapper(changeSubscription),
};
