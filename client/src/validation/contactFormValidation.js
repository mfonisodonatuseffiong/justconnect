/**
 * @description Schema to validate fcontact form field
 */

import Joi from "joi";

export const contactFormSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name should be at least 3 characters long.",
    "string.max": "Name cannot exceed 50 characters.",
  }),

  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Please provide a valid email address.",
    }),

  message: Joi.string().trim().min(10).max(500).required().messages({
    "string.empty": "Message cannot be empty.",
    "string.min": "Message should be at least 10 characters long.",
    "string.max": "Message cannot exceed 500 characters.",
  }),
});
