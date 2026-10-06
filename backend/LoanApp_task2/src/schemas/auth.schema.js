const Joi = require('joi');

const signupSchema = Joi.object({
    username: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().email().max(254).required(),
    password: Joi.string().min(8).max(72).required()
});

const loginSchema = Joi.object({
    email: Joi.string().trim().email().max(254).required(),
    password: Joi.string().min(1).max(72).required()
});

module.exports = {
    signupSchema,
    loginSchema
};
