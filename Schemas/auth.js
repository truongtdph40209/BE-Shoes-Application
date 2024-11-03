const Joi = require("joi");
exports.registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email không hợp lệ",
        "any.required": "Email là bắt buộc",
        "String.empty": "Email không được để trống"
    }),
    password: Joi.string().min(6).required().messages({
        "any.required": "Password là bắt buộc",
        "string.min": "Password phải có ít nhất {#limit} ký tự",
        "string.empty": "Password không được để trống"

    }),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
        "any.required": "Confirm password là bắt buộc",
        "any.only": "Confirm password không khớp với password",
        "string.empty": "Confirm password không được để trống"
    }),
    address: Joi.string().messages({
        "string.empty": "Address không được để trống",
    }),
    avatar: Joi.string().uri().messages({
        "string.uri": "Avatar không hợp lệ",
    })
});