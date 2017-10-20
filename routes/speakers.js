import db from "../models"
import Router from "koa-router"

const router = new Router({
    prefix: "/speakers"
})

router.get("/", async ctx => {
    const speakers = await db.Speaker.findAll({
        where: {
            published: true
        }
    })
    ctx.body = {
        speakers: speakers.map(speaker => ({
            id: speaker.id,
            name: speaker.name,
            email: speaker.email,
            location: speaker.location,
            photo: speaker.photo,
            interests: [],
            social_networks: []
        }))
    }
})

export default router
