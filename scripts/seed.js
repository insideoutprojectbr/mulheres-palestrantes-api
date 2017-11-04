import program from "commander"
import db from "../models"
import {Speaker} from "../services/speaker"
import {readFromFileOrUrl} from "../helpers/file"
import {logger} from "."


program.arguments("<path>").action(async path => {
    try{
        await db.sequelize.sync({force: true})
        const contents = await readFromFileOrUrl(path)
        const data = JSON.parse(contents)
        const speakers = await Speaker.bulkCreate(data.mulheres)
        logger.info(`${speakers.length} speakers created with success`)
        process.exit(0)
    }catch(error){
        logger.error(`Error processing data: ${error}`)
        process.exit(1)
    }
})

program.parse(process.argv)
