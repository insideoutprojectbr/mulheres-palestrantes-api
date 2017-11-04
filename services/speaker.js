import Promise from "bluebird"
import db from "../models"
import {filterFieldsFromObject} from "../helpers/object"

class Interest {

    static async associate(interests=[], speaker){
        const instances = await Promise.mapSeries(interests, async interest => {
            const instance = await db.Interest.findOne({
                where: {
                    name: interest
                }
            })
            return Object.is(instance, null) ? db.Interest.create({name: interest}) : instance
        })
        return speaker.setInterests(instances)
    }

}

class SocialNetwork {

    static bulkCreate(){
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

    static associate(data, speaker){
        const fields = [...Object.keys(db.Speaker.attributes), "interests"]
        const social_network_accounts = Object.entries(filterFieldsFromObject(data, fields))
        return Promise.mapSeries(social_network_accounts, ([network, username]) => {
            db.SocialNetwork.findAll().then(social_networks => {
                const map = new Map(social_networks.map(s => [s.name, s.id]))
                return db.SocialNetworkAccount.create({
                    social_network_id: map.get(network),
                    speaker_id: speaker.id,
                    username: username
                })
            }) || Promise.resolve([])
        })
    }
}

class Speaker {

    static create(data={}){
        const parseLocation = location => {
            return Array.isArray(location) ? location.join(",") : location
        }
        return db.Speaker.create({
            email: data.email,
            name: data.name,
            location: parseLocation(data.location),
            photo: data.photo,
            site: data.site,
            published: true,
            user_id: data.user_id
        })
    }

    static async createWithAssociations(data={}){
        const speaker = await this.create(data)
        await Interest.associate(data.interests, speaker)
        await SocialNetwork.associate(data, speaker)
        return speaker.reload()
    }

    static async bulkCreate(list=[]){
        await SocialNetwork.bulkCreate(list)
        return Promise.mapSeries(list, item => {
            return this.createWithAssociations(item)
        })
    }

}

export {Speaker, SocialNetwork, Interest}
