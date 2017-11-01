import {Strategy, ExtractJwt} from "passport-jwt"
import db from "../models"
import config from "../config"

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET_KEY
}

const JWTStrategy = new Strategy(options, async (jwt_payload, done) => {
    const user = await db.User.findById(jwt_payload.id)
    if (user){
        done(null, user)
    }
    done(new Error("user not found"), false)
})

export {JWTStrategy}
