import koaPassport from "koa-passport"
import {JWTStrategy} from "./strategies"


const passport = koaPassport.use(JWTStrategy)

const authenticateWithJWT = async (ctx, next) => {
    return await passport.authenticate("jwt", {session: false})(ctx, next)
}

export {passport, authenticateWithJWT}
