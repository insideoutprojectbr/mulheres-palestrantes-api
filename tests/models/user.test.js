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
    describe("#confirmAccount", () => {
        describe("unconfirmed account and valid key", () => {
            let user
            beforeEach(async done => {
                user = await factory.build("User", {confirmation_key: "key"})
                done()
            })
            test("it should confirm user account", () => {
                return user.confirmAccount("key").then(result => {
                    expect(result.confirmation_date).not.toBe(null)
                })
            })
        })
        describe("invalid key", () => {
            let user
            beforeEach(async done => {
                user = await factory.build("User", {confirmation_key: "key"})
                done()
            })
            test("it should raise error", () => {
                return user.confirmAccount("other").catch(error => {
                    expect(error.message).toBe("Invalid confirmation key")
                })
            })
        })
        describe("confirmed account", () => {
            let user
            beforeEach(async done => {
                user = await factory.build("User", {
                    confirmation_key: "key",
                    confirmation_date: new Date()
                })
                done()
            })
            test("it should raise error", () => {
                return user.confirmAccount("key").catch(error => {
                    expect(error.message).toBe("Account was already confirmed")
                })
            })
        })
    })

})
