import Joi from "joi"

function validateSchema(schema){
    return async function (ctx, next){
        const {error, value} =  Joi.validate(ctx.request.body, schema)
        if (error === null) {
            ctx.validatedData = value
            await next()
        }else{
            ctx.throw(400, error.message)
        }
    }
}

export default validateSchema
