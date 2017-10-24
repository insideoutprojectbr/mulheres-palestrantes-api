import db from "../models"
import Router from "koa-router"

const router = new Router({
    prefix: "/speakers"
})

router.get("/", async ctx => {
    const {query} = ctx.query
    const speakers = await db.Speaker.scope({method: ["searchable", query]}).findAll()
    ctx.body = {
        speakers: speakers.map(speaker => {
            const data = {
                id: speaker.id,
                name: speaker.name,
                email: speaker.email,
                location: speaker.location,
                photo : speaker.image,
                site: speaker.site,
                interests: speaker.Interests.map(interest => interest.name),
            }
            return Object.assign(data, speaker.socialNetworksByName)
        })
    }
})

export default router
