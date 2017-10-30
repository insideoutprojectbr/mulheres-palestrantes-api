import {logger} from "./app"

const handleError = async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        //TODO: Serializar melhor esses erros
        logger.error(err)
        ctx.status = err.status || 500
        let errors = [err]
        ctx.body = {errors: errors}
        ctx.app.emit("error", err, ctx)
    }
}

export {
    handleError
}
