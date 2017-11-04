import Promise from "bluebird"
import Router from "koa-router"
import db from "../models"
import {SpeakerSchema} from "../schemas/speaker"
import validateSchema from "../schemas/middleware"
import {Speaker} from "../services/speaker"
import {authenticateWithJWT} from "../auth/middleware"

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
router.post("/", authenticateWithJWT, validateSchema(SpeakerSchema), async ctx => {
    try{
        let data = ctx.validatedData
        data.user_id = ctx.user.id
        const speaker = await Speaker.createWithAssociations(data)
        ctx.body = {
            speaker: await speaker.getFullInfo()
        }
        ctx.status = 201
    }catch (error){
        ctx.throw(422, error)
    }
})
router.get("/:id", async ctx => {
    try{
        const speaker = await db.Speaker.findById(parseInt(ctx.params.id))
        ctx.body = {
            speaker: await speaker.getFullInfo()
        }
    }catch (error){
        ctx.throw(404, "speaker not found")
    }
})


export default router
