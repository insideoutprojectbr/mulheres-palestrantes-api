import Koa from "koa"
import Router from "koa-router"
import cache from "koa-redis-cache"
import {handleError} from "./handlers"
import healthcheck from "./routes/healthcheck"
import speakers from "./routes/speakers"
import winston from "winston"
import cors from "kcors"
import config from "./config"

const logger = winston.createLogger({
    level: config.LOG_LEVEL,
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new (winston.transports.File)({ filename: "default.log" })
    ]
})

const app = new Koa()

app.use(cors({origin: config.CORS_ALLOWED_ORIGIN}))

if (config.NODE_ENV !== "test"){
    app.use(cache({
        redis: {
            url: config.REDIS_URL
        },
        exclude: ["/api/healthcheck"],
        expire: config.REDIS_EXPIRATION_IN_SECONDS,
        onerror: (err) => {
            logger.error(err)
        }
    }))
}

let api = new Router({
    prefix: "/api"
})
api.use(healthcheck.routes(), healthcheck.allowedMethods())
api.use(speakers.routes(), speakers.allowedMethods())
app.use(api.routes())
app.use(api.allowedMethods())
app.on("error", handleError)
export {app, logger}
