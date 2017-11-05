import koaPassport from "koa-passport"
import {JWTStrategy} from "./strategies"

const passport = koaPassport.use(JWTStrategy)

const authenticateWithJWT = async (ctx, next) => {
    await passport.authenticate("jwt", { session: false }, (info, user, err) => {
        if (err){
            ctx.throw(401, err)
        }else{
            ctx.state.user = user
            return next()
        }
    })(ctx, next)
}

export {passport, authenticateWithJWT}
