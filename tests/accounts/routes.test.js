import {app} from "../../app"
import {Account} from "../../accounts/actions"
import {AccountConfirmationMailer} from "../../mailers"
import factory from "../factories"
import db from "../../models"
import request from "supertest"
import sinon from "sinon"

describe("POST /api/accounts", () => {
    let sandbox
    const data = {
        email: "john_doe@email.com",
        password: "pass"
    }
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
        sandbox.restore()
    })
    describe("Valid data", () => {
        test("It should return new account data", () => {
            sandbox.stub(AccountConfirmationMailer.prototype, "send").resolves()
            const mock = sandbox.stub(Account.prototype, "create").returns(db.User.create(data))
            return request(app.callback())
                .post("/api/accounts")
                .set("Accept", "application/json")
                .set("Content-Type", "application/json")
                .send(data)
                .then(response => {
                    expect(response.statusCode).toBe(201)
                    expect(response.body.user.email).toEqual(data.email)
                    expect(mock.called).toBe(true)
                })
        })
    })
    describe("Invalid data", () => {
        test("It should return error", () => {
            const mock = sandbox.stub(Account.prototype, "create").rejects(new Error("Invalid email address"))
            return request(app.callback())
                .post("/api/accounts")
                .set("Accept", "application/json")
                .set("Content-Type", "application/json")
                .send(data)
                .then(response => {
                    expect(response.status).toBe(422)
                    expect(mock.called).toBe(true)
                })
        })
    })
})
describe("GET /api/:account_id/confirmation", () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })
    afterEach(() => {
        sandbox.restore()
    })
    describe("user unconfirmed", () => {
        let user
        beforeEach(async done => {
            user = await factory.create("User")
            done()
        })
        it("should send confirmation with confirmation link", () => {
            const mock = sandbox.stub(AccountConfirmationMailer.prototype, "send").resolves()
            return request(app.callback())
                .get(`/api/accounts/${user.id}/confirmation`)
                .set("Accept", "application/json")
                .set("Content-Type", "application/json")
                .then(response => {
                    expect(response.statusCode).toBe(204)
                    expect(mock.called).toBe(true)
                })
        })
    })
    describe("user already confirmed", () => {
        let user
        beforeEach(async done => {
            user = await factory.create("User", {confirmation_date: new Date()})
            done()
        })
        it("should return error", () => {
            const mock = sandbox.stub(AccountConfirmationMailer.prototype, "send").resolves()
            return request(app.callback())
                .get(`/api/accounts/${user.id}/confirmation`)
                .set("Accept", "application/json")
                .set("Content-Type", "application/json")
                .then(response => {
                    expect(response.statusCode).toBe(422)
                    expect(mock.called).toBe(false)
                })
        })
    })
    describe("invalid account_id", () => {
        it("should return error", () => {
            return request(app.callback())
                .get("/api/accounts/0/confirmation")
                .set("Accept", "application/json")
                .set("Content-Type", "application/json")
                .then(response => {
                    expect(response.statusCode).toBe(422)
                })
        })
    })

})
describe("POST /api/:account_id/confirmation", () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })
    afterEach(() => {
        sandbox.restore()
    })
    describe("user unconfirmed", () => {
        let user
        beforeEach(async done => {
            user = await factory.create("User")
            done()
        })
        it("should confirm user account", () => {
            const mock = sandbox.stub(db.User.prototype, "confirm").returns(user)
            return request(app.callback())
                .post(`/api/accounts/${user.id}/confirmation`)
                .set("Accept", "application/json")
                .set("Content-Type", "application/json")
                .send({key: user.confirmation_key})
                .then(response => {
                    expect(response.statusCode).toBe(201)
                    expect(mock.calledWith(user.confirmation_key)).toBe(true)
                })
        })
    })
    describe("user already confirmed", () => {
        let user
        beforeEach(async done => {
            user = await factory.create("User", {confirmation_date: new Date()})
            done()
        })
        it("should return error", () => {
            const mock = sandbox.stub(db.User.prototype, "confirm").rejects(new Error("User already confirmed"))
            return request(app.callback())
                .post(`/api/accounts/${user.id}/confirmation`)
                .set("Accept", "application/json")
                .set("Content-Type", "application/json")
                .send({key: user.confirmation_key})
                .then(response => {
                    expect(response.statusCode).toBe(422)
                    expect(mock.called).toBe(true)
                })
        })
    })
    describe("invalid parameters", () => {
        let user
        beforeEach(async done => {
            user = await factory.create("User")
            done()
        })
        it("should return error", () => {
            return request(app.callback())
                .post(`/api/accounts/${user.id}/confirmation`)
                .set("Accept", "application/json")
                .set("Content-Type", "application/json")
                .then(response => {
                    expect(response.statusCode).toBe(400)
                })
        })
    })
})
