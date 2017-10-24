import {factory, SequelizeAdapter} from "factory-girl"
import db from "../models"

const adapter = new SequelizeAdapter()

factory.setAdapter(adapter)

factory.define("Speaker", db.Speaker, {
    id: factory.sequence("Speaker.id"),
    name: factory.chance("name"),
    email: factory.chance("email"),
    location: factory.chance("city"),
    photo: factory.chance("avatar"),
    site: factory.chance("url"),
    published: true
})

factory.define("Interest", db.Interest, {
    id: factory.sequence("Interest.id"),
    name: factory.chance("sentence")
})

factory.define("SocialNetwork", db.SocialNetwork, {
    id: factory.sequence("SocialNetwork.id"),
    name: factory.chance("word"),
    url: factory.chance("url")
})

factory.define("SocialNetworkAccount", db.SocialNetworkAccount, {
    id: factory.sequence("SocialNetworkAccount.id"),
    username: factory.chance("word"),
    speaker_id: factory.assoc("Speaker", "id"),
    social_network_id: factory.assoc("SocialNetwork", "id")
})


export default factory
