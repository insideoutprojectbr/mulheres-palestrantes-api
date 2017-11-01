import Joi from "joi"

const LoginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export {LoginSchema}
