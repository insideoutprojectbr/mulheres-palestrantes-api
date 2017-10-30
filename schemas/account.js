import Joi from "joi"

const AccountSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
})

const AccountConfirmationSchema = Joi.object().keys({
    key: Joi.string().required()
})

export {AccountSchema, AccountConfirmationSchema}
