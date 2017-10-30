import Promise from "bluebird"
import * as image from "../../helpers/image"
import sinon from "sinon"
import factory from "../factories"

describe("Speaker", () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })
    afterEach(() => {
        sandbox.restore()
    })
    describe("#image", () => {
        describe("with photo", () => {
            let speaker
            beforeEach(done => {
                factory.build("Speaker").then(result => {
                    speaker = result
                    done()
                })
            })
            test("it should return user photo", () => {
                expect(speaker.image).toEqual(speaker.photo)
            })
        })
        describe("without photo", () => {
            let speaker
            beforeEach(done => {
                factory.build("Speaker", {photo: null}).then(result => {
                    speaker = result
                    done()
                })
            })
            test("it should return gravatar url", () => {
                const url = "//www.gravatar.com/avatar/68328f099165564e758f8bd7c0a7ae05?size=40&rating=pg&default=http%3A%2F%2Finsideoutproject.xyz%2Fmulheres-palestrantes%2Fimg%2Fplaceholder-female.jpg"
                const generateGravatarUrl = sandbox.stub(image, "generateGravatarUrl").returns(url)
                expect(speaker.image).toEqual(url)
                expect(generateGravatarUrl.calledWith(speaker.email)).toBe(true)
            })
        })
    })
    describe("#getInterestList", () => {
        let speaker
        beforeEach(done => {
            factory.build("Speaker").then(result => {
                speaker = result
                done()
            })
        })
        test("it should a list of interests", () => {
            sandbox.stub(speaker, "fetchAssociation").returns(Promise.resolve([{name: "NodeJs"}, {name: "Python"}]))
            return speaker.getInterestList().then(list =>
                expect(list).toEqual(["NodeJs", "Python"])
            )
        })
    })
    describe("#getFullInfo", () => {

    })
    describe("#groupSocialNetworksByName", () => {
        let speaker
        let social_networks
        beforeEach(done => {
            Promise.join(
                factory.create("Speaker"),
                factory.create("SocialNetwork", {url: "http://social.com/username"}),
                (speaker, network) => {
                    social_networks = [network]
                    return Promise.join(
                        Promise.map(social_networks, sn => factory.create("SocialNetworkAccount", {
                            "username": "user",
                            speaker_id: speaker.id,
                            social_network_id: sn.id,
                        })), () => {
                            return speaker.reload()
                        })
                }).then(response => {
                speaker = response
                done()
            })
        })
        test("it should return an object", () => {
            return speaker.groupSocialNetworksByName().then(result => {
                expect(result).toEqual({
                    [social_networks[0].name]: "http://social.com/user"
                })
            })
        })
    })
})
