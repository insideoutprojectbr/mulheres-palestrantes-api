import db from "../models"
import Router from "koa-router"
import {AccountSchema, AccountConfirmationSchema} from "../schemas/account"
import validateSchema from "../schemas/middleware"
import {Notification, Signup} from "./actions"

const router = new Router({
    prefix: "/accounts"
})

router.post("/", validateSchema(AccountSchema), async ctx => {
    try{
        const signup = new Signup(ctx.validatedData)
        const user = await signup.process()
        ctx.status = 201
        ctx.body = {
            user: {
                id: user.id,
                email: user.email,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
        }
    }catch(error){
        ctx.throw(422, error)
    }
})

router.get("/:account_id/confirmation", async ctx => {
    try{
        const user = await db.User.findOne({
            where: {
                id: ctx.params.account_id,
                confirmation_date: null
            }
        })
        if (Object.is(user, null)){
            throw new Error("User not found")
        }
        const notification = new Notification(user)
        await notification.send()
        ctx.status = 204
    } catch(error){
        ctx.throw(422, error)
    }
})

router.post("/:account_id/confirmation", validateSchema(AccountConfirmationSchema), async ctx => {
    try{
        const user = await db.User.findOne({
            where: {
                id: ctx.params.account_id
            }
        }).then(user => user.confirmAccount(ctx.validatedData.key))
        ctx.status = 201
        ctx.body = {
            confirmation: {
                account_id: user.id,
                confirmation_date: user.confirmation_date
            }
        }
    }catch(error){
        ctx.throw(422, error)
    }
})
export default router
