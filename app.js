import Koa from "koa"
import Router from "koa-router"
import cache from "koa-redis-cache"
import winston from "winston"
import cors from "kcors"
import swagger from "koa2-swagger-ui"
import bodyParser from "koa-bodyparser"
import {readFromFileOrUrl} from "./helpers/file"
import {handleError} from "./handlers"
import healthcheck from "./routes/healthcheck"
import speakers from "./routes/speakers"
import accounts from "./routes/accounts"
import auth from "./auth/routes"
import config from "./config"
import {passport} from "./auth/middleware"


const logger = winston.createLogger({
    level: config.LOG_LEVEL,
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new (winston.transports.File)({ filename: "default.log" })
    ]
})

const app = new Koa()

const protocol = config.NODE_ENV === "production" ? "https" : "http"

app.use(bodyParser())
app.use(handleError)
app.use(cors({origin: config.CORS_ALLOWED_ORIGIN}))
app.use(passport.initialize())

if (config.NODE_ENV === "production"){
    app.use(cache({
        redis: {
            url: config.REDIS_URL
        },
        include: ["/api/speakers", "/api/speakers/(.*)"],
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
api.use(accounts.routes(), accounts.allowedMethods())
api.use(auth.routes(), auth.allowedMethods())

api.get("/docs/swagger.json", async ctx => {
    const file = await readFromFileOrUrl(`${__dirname}/docs/swagger.json`)
    ctx.body = Object.assign(JSON.parse(file), {schemes: [protocol]})
})

app.use(api.routes())
app.use(api.allowedMethods())
app.use(async (ctx, next) => {
    swagger({
        routePrefix: "/api/docs",
        swaggerOptions: {
            url: `${protocol}://${ctx.host}/api/docs/swagger.json`
        }
    })(ctx, next)
})
export {app, logger}
