/**
 * @description: This creates a joi schema for all auth validations
 */

import Joi from "joi";

// login validation schema
export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

export const registerSchema = Joi.object({
  name: Joi.string().min(6).required().messages({
    "string.empty": "Please enter your full name",
    "string.min": "Name must be 6 letters long",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email cannot be empty",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  role: Joi.string().required().messages({
    "string.empty": "Please select a role to continue",
    "any.required": "Selecting a role is required",
  }),

  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be minimum of 8 characters",
    "any.required": "Password is required",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "string.empty": "confirm password cannot be empty",
    "any.only": "Passwords do not match",
    "any.required": "Confirm Password is required",
  }),
  isChecked: Joi.boolean().valid(true).required().messages({
    "any.only": "Please agree terms and policies to continue",
    "any.required": "You must agree to terms and policies to continue",
  }),
});
