import config from "../config"
import jwt from "jsonwebtoken"

const generateToken = user => {
    return jwt.sign({
        id: user.id
    }, config.JWT_SECRET_KEY, {}, {
        expireIn: config.JWT_EXPIRATION_IN_SECONDS
    })
}

export {generateToken}
