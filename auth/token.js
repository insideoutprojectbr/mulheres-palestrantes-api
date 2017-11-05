import config from "../config"
import jwt from "jsonwebtoken"

const generateToken = user => {
    return jwt.sign({
        id: user.id
    }, config.JWT_SECRET_KEY, {
        expiresIn: config.JWT_EXPIRATION
    })
}

export {generateToken}
