import Promise from "bluebird"
import program from "commander"
import db from "../models"
import {dedup, flatten} from "../utils/array"
import {readFromFileOrUrl} from "../utils/file"
import {logger} from "."

function associateInterests(speaker, interests){
    return db.Interest.findAll({where: {name: interests}})
        .then(interests => speaker.setInterests(interests))
        .then(() => Promise.resolve(speaker))
}

function filterFieldsFromObject(object, fields=[]){
    return Object.entries(object).reduce((total, [key, value]) => Object.assign(total, value !== null && fields.indexOf(key) === -1 ? {[key]: value} : {}), {})
}

function associateToSocialNetworks(speaker, data){
    let fields = [...Object.keys(db.Speaker.attributes), "interests"]
    return Promise.mapSeries(Object.entries(filterFieldsFromObject(data, fields)), ([field, value]) =>{
        return db.SocialNetwork.findAll()
            .then(social_networks => {
                const map = new Map(social_networks.map(s => [s.name, s.id]))
                return db.SocialNetworkAccount.create({
                    social_network_id: map.get(field),
                    speaker_id: speaker.id,
                    username: value
                })
            })
            .then(() => Promise.resolve(speaker))
            .catch((e) => logger.error(e))
    })
}

function createInterests(data){
    const items = dedup(flatten(data.map(item => item.interests)))
    return db.Interest.bulkCreate(Array.from(items).map(interest => ({name: interest})))
}

function createSocialNetworks(){
    return db.SocialNetwork.bulkCreate([
        {
            name: "linkedin",
            url: "//www.linkedin.com/in/username"
        },
        {
            name: "github",
            url: "//github.com/username"
        },
        {
            name: "twitter",
            url: "//twitter.com/username"
        },
        {
            name: "fb",
            url: "//facebook.com/username"
        },
        {
            name: "behance",
            url: "//www.behance.net/username"
        }
    ])
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
        .then(speaker => associateToSocialNetworks(speaker, item))
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
