/**
 *  creates validators for user authentication
 *  This verifies all you are getting from fronetend
 */
const joi = require("joi");

// Registration schema
const registerSchema = joi.object({
    name: joi.string().required().messages({
        "string.empty": `Name cannot be empty`,
        "any.required": `Name is required`
    }),
    email: joi.string().email().required().messages({
        "string.email": `Not a valid email address`,
        "any.required": `Email is required`
    }),
    password: joi.string().min(8).required().messages({
        "string.min": `Password must be at least 8 characters`,
        "any.required": `Password is required`,

    }),
})

/** Login schema */
const loginSchema = joi.object({

    email: joi.string().email().required().messages({
        "string.email": `Not a valid email address`,
        "any.required": `Email is required`
    }),
    password: joi.string().required().messages({
        "string.empty": `Password cannot be empty`,
        "any.required": `Password is required`,

    }),
})

/** forget password schema */
const forgetPasswordSchema = joi.object({
    email: joi.string().email().required().messages({
        "string.empty": `Email cannot be empty❌`,
        "string.email": `Please input a valid email address ❌`,
        "any.required": `Registered email is required❌`
    })
})

module.exports = {
    registerSchema,
    loginSchema,
    forgetPasswordSchema
}