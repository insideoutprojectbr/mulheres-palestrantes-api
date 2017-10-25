import {app} from "../../app"
import db from "../../models"
import request from "supertest"
import sinon from "sinon"
import factory from "../factories"
import Promise from "bluebird"
describe("Speakers GET by id route", () => {
    describe("invalid id", () => {
        test("it should return correct error status code", () => {
            return request(app.callback())
                .get("/api/speakers/1")
                .set("Accept", "application/json")
                .set("Content-Type", "application/json")
                .then(response => {
                    expect(response.statusCode).toBe(404)
                })
        })
    })
    describe("valid id", () => {
        let speaker
        beforeEach(done => {
            Promise.join(
                factory.create("Speaker"),
                factory.createMany("Interest", 2),
                factory.createMany("SocialNetwork", 2),
                (speaker, interests, social_networks) => {
                    return Promise.join(
                        speaker.setInterests(interests),
                        Promise.map(social_networks, sn => factory.create("SocialNetworkAccount", {
                            speaker_id: speaker.id,
                            social_network_id: sn.id
                        })), () => Promise.resolve(speaker.reload()))
                }).then(response => {
                speaker = response
                done()
            })
        })
        test("it should return speaker data", () => {
            return request(app.callback())
                .get(`/api/speakers/${speaker.id}`)
                .set("Accept", "application/json")
                .set("Content-Type", "application/json")
                .then(response => {
                    expect(response.statusCode).toBe(200)
                })
        })
    })
})
describe("Speakers GET route", () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
        sandbox.restore()
    })
    describe("without any speaker created", () => {
        test("It should return empty list", () => {
            return request(app.callback())
                .get("/api/speakers")
                .set("Accept", "application/json")
                .set("Content-Type", "application/json")
                .then(response => {
                    expect(response.statusCode).toBe(200)
                    expect(response.body).toEqual({speakers: []})
                })
        })
    })
    describe("with some speakers created", () => {
        let speakers
        let interests
        let social_networks
        beforeEach(done => {
            Promise.join(
                factory.createMany("Interest", 2),
                factory.createMany("Speaker", 3),
                factory.createMany("SocialNetwork", 2),
                (ints, speakers, networks) => {
                    interests = ints
                    social_networks = networks
                    return Promise.map(speakers, speaker => {
                        return Promise.join(
                            speaker.setInterests(interests),
                            Promise.map(social_networks, sn => factory.create("SocialNetworkAccount", {
                                speaker_id: speaker.id,
                                social_network_id: sn.id
                            })), () => Promise.resolve(speaker.reload()))
                    }) }).then(list => {
                speakers = list
                done()
            })
        })
        describe("without any filter", () => {
            test("It should return all speakers", () => {
                return request(app.callback())
                    .get("/api/speakers")
                    .set("Accept", "application/json")
                    .set("Content-Type", "application/json")
                    .then(response => {
                        const verifyItem = (item, speaker) => {
                            expect(item.id).toEqual(speaker.id)
                            expect(item.name).toEqual(speaker.name)
                            expect(item.email).toEqual(speaker.email)
                            expect(item.location).toEqual(speaker.location)
                            expect(item.interests).toEqual([interests[0].name, interests[1].name])
                        }
                        expect(response.statusCode).toBe(200)
                        expect(response.body.speakers.length).toEqual(speakers.length)
                        verifyItem(response.body.speakers[0], speakers[0])
                        verifyItem(response.body.speakers[1], speakers[1])
                    })
            })
        })
        describe("with filter", () => {
            test("It should apply given filter to speaker list", () => {
                const findByQuery = sandbox.stub(db.Speaker, "findByQuery").returns(Promise.resolve([]))
                return request(app.callback())
                    .get("/api/speakers")
                    .query({query: "aa"})
                    .set("Accept", "application/json")
                    .set("Content-Type", "application/json")
                    .then(response => {
                        expect(findByQuery.calledWith("aa")).toBe(true)
                        expect(response.body.speakers).toEqual([])
                    })
            })
        })
    })
})
