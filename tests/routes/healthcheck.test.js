import {app} from "../../app"
import db from "../../models"
import request from "supertest"
import sinon from "sinon"
import Promise from "bluebird"

describe("Healthcheck route", () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
        sandbox.restore()
    })
    describe("Database down", () => {
        test("It should return status as down", () => {
            sandbox.stub(db.sequelize, "authenticate").returns(Promise.reject())
            return request(app.callback())
                .get("/api/healthcheck")
                .set("Accept", "application/json")
                .set("Content-Type", "application/json")
                .then(response => {
                    expect(response.statusCode).toBe(200)
                    expect(response.body.status).toEqual("down")
                })
        })
    })
    describe("Database up", () => {
        test("It should return status as up", () => {
            sandbox.stub(db.sequelize, "authenticate").returns(Promise.resolve())
            return request(app.callback())
                .get("/api/healthcheck")
                .set("Accept", "application/json")
                .set("Content-Type", "application/json")
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.body.status).toEqual("ok")
                })
        })
    })
})
