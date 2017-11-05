import {Strategy} from "passport-jwt"
import db from "../models"
import config from "../config"

const options = {
    jwtFromRequest: function extractToken(req){
        const token = (req.header.authentication || "").replace("Bearer", "").replace("bearer", "").replace(" ", "")
        return token
    },
    secretOrKey: config.JWT_SECRET_KEY
}

const JWTStrategy = new Strategy(options, (jwt_payload, done) => {
    db.User.findById(jwt_payload.id).then(user => {
        if (user) {
            return done(null, user)
        }
        return done(null, false)
    }).catch(err => done(err, false))
})

export {JWTStrategy}
