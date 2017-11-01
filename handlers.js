import {logger} from "./app"

const serializeError = error => {
    if (error.errors){
        return error.errors.map(error => ({[error.path]: error.message }))
    }
    if (error.details){
        return error.details.map(error => ({[error.path]: error.message }))
    }
    return [{non_field_error: error.message}]
}

const handleError = async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        logger.error(err)
        ctx.status = err.status || 500
        ctx.body = {errors: serializeError(err)}
        ctx.app.emit("error", err, ctx)
    }
}

export {
    handleError
}
