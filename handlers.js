import {logger} from "./app"

const handleError = (err, ctx) => { // eslint-disable-line no-unused-vars
    logger.error(err)
}

export {
    handleError
}
