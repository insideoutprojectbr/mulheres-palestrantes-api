import db from "../models"
import Router from "koa-router"
import {AccountSchema, AccountConfirmationSchema} from "../schemas/account"
import validateSchema from "../schemas/middleware"
import {Account} from "../services/account"
import {AccountConfirmationMailer} from "../mailers"

const router = new Router({
    prefix: "/accounts"
})

router.post("/", validateSchema(AccountSchema), async ctx => {
    try{
        const account = new Account(ctx.validatedData)
        const user = await account.create()
        const mail = new AccountConfirmationMailer(user)
        mail.send()
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
        const mail = new AccountConfirmationMailer(user)
        mail.send()
        ctx.status = 204
    } catch(error){
        ctx.throw(422, error)
    }
})

router.post("/:account_id/confirmation", validateSchema(AccountConfirmationSchema), async ctx => {
    try{
        const user = await db.User.findById(ctx.params.account_id).then(user => user.confirm(ctx.validatedData.key))
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
