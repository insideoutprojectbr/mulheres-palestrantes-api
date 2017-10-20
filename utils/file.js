import superagent from "superagent"
import Promise from "bluebird"

function readFromFileOrUrl(path){
    const fs = Promise.promisifyAll(require("fs"))
    return Promise.any([
        fs.readFileAsync(path, "utf-8"),
        superagent.get(path).then(response => Promise.resolve(response.text))
    ])
}

export {readFromFileOrUrl}
