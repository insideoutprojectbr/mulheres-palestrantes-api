import Koa from "koa"
import Router from "koa-router"
import {handleError} from "./handlers"
import healthcheck from "./routes/healthcheck"
import speakers from "./routes/speakers"
import winston from "winston"
// import config from "./config"

const logger = winston.createLogger({
    level: "info",
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new (winston.transports.File)({ filename: "default.log" })
    ]
})

const app = new Koa()
let api = new Router({
    prefix: "/api"
})
api.use(healthcheck.routes(), healthcheck.allowedMethods())
api.use(speakers.routes(), speakers.allowedMethods())
app.use(api.routes())
app.use(api.allowedMethods())
app.on("error", handleError)
export {app, logger}
