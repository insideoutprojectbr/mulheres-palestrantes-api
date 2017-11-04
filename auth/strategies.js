import {Strategy} from "passport-jwt"
import db from "../models"
import config from "../config"

const options = {
    jwtFromRequest: function extractToken(req){
        return (req.header.authentication || "").replace("Bearer", "").replace("bearer", "").replace(" ", "")
    },
    secretOrKey: config.JWT_SECRET_KEY
}

const JWTStrategy = new Strategy(options, (jwt_payload, done) => {
    db.User.findById(jwt_payload.id).then(user => {
        if (user){
            done(null, user)
        }else{
            done(new Error("user not found"), false)
        }
    }).catch(err => done(err, false))
})

export {JWTStrategy}
