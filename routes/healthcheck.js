import db from "../models"
import Router from "koa-router"

const router = new Router()

router.get("/healthcheck", async ctx => {
    try {
        await db.sequelize.authenticate()
        ctx.body = {"status": "ok"}
    } catch (e) {
        ctx.body = {"status": "down"}
    }
})

export default router
