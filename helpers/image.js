import gravatar from "gravatar"
import config from "../config"

function generateGravatarUrl(email){
    return gravatar.url(email, {
        size: "40",
        rating: "pg",
        default: config.PLACEHOLDER_URL
    })
}

export {generateGravatarUrl}
