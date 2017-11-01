import db from "../models"
import Router from "koa-router"
import {LoginSchema} from "../schemas/auth"
import validateSchema from "../schemas/middleware"
import {generateToken} from "./token"

const router = new Router({
    prefix: "/auth"
})

router.post("/login", validateSchema(LoginSchema), async ctx => {
    try{
        const user = await db.User.scope("active").findOne({
            where: {
                email: ctx.validatedData.email
            }
        })
        if (Object.is(user, null) || !user.verifyPassword(ctx.validatedData.password)){
            throw Error("Invalid credentials")
        }
        ctx.status = 200
        ctx.body = {
            token: generateToken(user)
        }
    }catch(error){
        ctx.throw(422, error)
    }
})

export default router
