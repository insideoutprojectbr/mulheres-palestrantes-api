import Promise from "bluebird"
import Router from "koa-router"
import db from "../models"

const router = new Router({
    prefix: "/speakers"
})

router.get("/", async ctx => {
    const {query} = ctx.query
    const speakers = await db.Speaker.findByQuery(query).
        then(speakers => Promise.map(speakers, speaker => speaker.getFullInfo())) || []
    ctx.body = {
        speakers: speakers
    }
})
router.get("/:id", async ctx => {
    try{
        const speaker = await db.Speaker.findById(parseInt(ctx.params.id))
        ctx.body = {speaker: await speaker.getFullInfo()}
    }catch (error){
        ctx.throw(404, "speaker not found")
    }
})


export default router
