const {Schema, model} = require("mongoose");
const Joi = require("joi");

const handleMongooseError = require("../helpers/handleMongooseError");

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: "",
    },
}, {versionKey: false, timestamps: true});

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
    // name: Joi.string().required().messages({
    //     "any.required": "missing required 'name' field",
    // }),
    email: Joi.string().required().messages({
        "any.required": "missing required 'email' field",
    }),
    password: Joi.string().required().messages({
        "any.required": "missing required 'password' field",
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().required().messages({
        "any.required": "missing required 'email' field",
    }),
    password: Joi.string().required().messages({
        "any.required": "missing required 'password' field",
    }),
});

const subscriptionSchema = Joi.object({
    id: Joi.string().required(),
    subscription: Joi.string().valid("starter", "pro", "business").required().messages({
        "any.required": "missing required 'subscription' field",
        "any.only": "invalid 'subscription' value. Available options: 'starter', 'pro', 'business'.",
    }),
})

const schemas = {
    registerSchema,
    loginSchema,
    subscriptionSchema,
};

const User = model("user", userSchema);

module.exports = {
    User,
    schemas,
};
