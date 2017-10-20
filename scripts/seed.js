import Promise from "bluebird"
import program from "commander"
import db from "../models"
import {dedupe, flatten} from "../utils/array"
import {readFromFileOrUrl} from "../utils/file"
import {logger} from "."

function associateInterests(speaker, interests){
    return db.Interest.findAll({where: {name: interests}})
        .then(interests => speaker.setInterests(interests))
        .then(() => Promise.resolve(speaker))
}

function associateToSocialNetworks(speaker, social_networks){
    return Promise.mapSeries(Object.entries(social_networks), (field, value) => {
        return db.SocialNetwork.findAll()
            .then(social_networks => {
                const map = new Map(social_networks.map(s => [s.name, s.id]))
                return db.SocialNetworkAccount.create({social_network_id: map.get(value), speaker_id: speaker.id, username: value})
            }).then(() => Promise.resolve(speaker))
    })
}

function createInterests(data){
    const items = dedupe(flatten(data.map(item => item.interests)))
    return db.Interest.bulkCreate(Array.from(items).map(interest => ({name: interest})))
}

function filterFields(item){
    let fields = [...Object.keys(db.Speaker.associations), ...Object.keys(db.Speaker.attributes)]
    fields = fields.map(f => f.toLowerCase())
    return Object.keys(item).filter(key => fields.indexOf(key) === -1)
}

function createSocialNetworks(data){
    const items = dedupe(flatten(data.map(item => filterFields(item))))
    return db.SocialNetwork.bulkCreate(Array.from(items).map(social_network => ({name: social_network})))
}

function createSpeaker(item){
    const parseLocation = location => {
        return Array.isArray(location) ? location.join(",") : location
    }
    return db.Speaker.create({
        email: item.email,
        name: item.name,
        location: parseLocation(item.location),
        photo: item.photo,
        site: item.site,
        published: true
    })
}

function createSpeakerWithAssociations(item){
    return createSpeaker(item)
        .then(speaker => associateInterests(speaker, item.interests))
        .then(speaker => associateToSocialNetworks(speaker, filterFields(item)))
}

program.arguments("<path>").action(async path => {
    try{
        const contents = await readFromFileOrUrl(path)
        const data = JSON.parse(contents)
        await db.sequelize.sync({force: true})
        await createInterests(data.mulheres)
        await createSocialNetworks(data.mulheres)
        const speakers = await Promise.mapSeries(data.mulheres, item => createSpeakerWithAssociations(item))
        logger.info(`${speakers.length} speakers created with success`)
        process.exit(0)
    }catch(error){
        logger.error(`Error processing data: ${error}`)
        process.exit(1)
    }
})

program.parse(process.argv)
