import koaPassport from "koa-passport"
import {JWTStrategy} from "./strategies"

const passport = koaPassport.use(JWTStrategy)

const authenticateWithJWT = passport.authenticate("jwt", {session: false}, (req, res, next) => {
    return passport.authenticate("jwt", { session: false }, (err, user) => {
        if (user && !err) {
            req.user = user
            next()
        } else {
            next(err)
        }
    })(req, res, next)
})

export {passport, authenticateWithJWT}
