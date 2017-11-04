import Joi from "joi"

const SpeakerSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    location: Joi.string().required(),
    photo: Joi.string(),
    site: Joi.string(),
    interests: Joi.array().items(Joi.string()),
    linkedin: Joi.string(),
    github: Joi.string(),
    twitter: Joi.string(),
    fb: Joi.string(),
    behance: Joi.string()
})

export {SpeakerSchema}
