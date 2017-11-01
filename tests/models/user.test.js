import sinon from "sinon"
import config from "../../config"
import factory from "../factories"

describe("Speaker", () => {
    let sandbox
    let user
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })
    afterEach(() => {
        sandbox.restore()
    })
    describe("#account_confirmation_url", () => {
        beforeEach(async () => {
            sandbox.stub(config, "EMAIL_CONFIRMATION_URL").value("http://url.com")
            user = await factory.create("User", {id: 1, confirmation_key: "random"})
        })
        test("should generate correct url", () => {
            expect(user.account_confirmation_url).toEqual("http://url.com/accounts/1/confirmation?key=random")
        })
    })
    describe("#confirm", () => {
        describe("unconfirmed account and valid key", () => {
            let user
            beforeEach(async () => {
                user = await factory.build("User", {confirmation_key: "key"})
            })
            test("it should confirm user account", async () => {
                const result = await user.confirm("key")
                expect(result.confirmation_date).not.toBe(null)
            })
        })
        describe("invalid key", () => {
            let user
            beforeEach(async () => {
                user = await factory.build("User", {confirmation_key: "key"})
            })
            test("it should raise error", () => {
                return user.confirm("other").catch(error => {
                    expect(error.message).toBe("Invalid confirmation key")
                })
            })
        })
        describe("confirmed account", () => {
            let user
            beforeEach(async () => {
                user = await factory.build("User", {
                    confirmation_key: "key",
                    confirmation_date: new Date()
                })
            })
            test("it should raise error", () => {
                return user.confirm("key").catch(error => {
                    expect(error.message).toBe("Account was already confirmed")
                })
            })
        })
    })

})
