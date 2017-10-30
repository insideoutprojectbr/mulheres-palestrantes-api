import sinon from "sinon"
import sgMail from "@sendgrid/mail"
import mailConfirm from "mail-confirm"
import factory from "../factories"
import config from "../../config"
import {Notification, Signup} from "../../accounts/actions"
import db from "../../models"

describe("Notification", () => {
    let sandbox
    let user
    beforeEach(async done => {
        sandbox = sinon.sandbox.create()
        sandbox.stub(config, "EMAIL_CONFIRMATION_URL").value("http://url.com")
        sandbox.stub(config, "SENDGRID_EMAIL_FROM").value("from@email.com")
        user = await factory.create("User", {id: 1, confirmation_key: "random"})
        done()
    })
    afterEach(() => {
        sandbox.restore()
    })
    describe("#url", () => {
        test("should generate correct url", () => {
            const notification = new Notification(user)
            expect(notification.url).toEqual("http://url.com/accounts/1/confirmation?key=random")
        })
    })
    describe("#send", () => {
        it ("it should call sendGrid service", () => {
            const mock = sandbox.stub(sgMail, "send").resolves()
            const notification = new Notification(user)
            return notification.send().then(() => {
                expect(mock.called).toBe(true)
            })
        })
    })
})
describe("Signup", () => {
    let sandbox
    beforeEach(async () => {
        sandbox = sinon.sandbox.create()
    })
    afterEach(() => {
        sandbox.restore()
    })
    describe("#sendNotification", () => {
        it("should call notification service", () => {
            const mock = sandbox.stub(Notification.prototype, "send")
            const signup = new Signup({
                email: "john_doe@mail.com",
                password: "pass"
            })
            signup.sendNotification()
            expect(mock.called).toBe(true)
        })
    })
    describe("#checkIfEmailIsValid", () => {
        it("should validate email address", () => {
            const mock = sandbox.stub(mailConfirm.prototype, "check").resolves()
            const signup = new Signup({
                email: "john_doe@mail.com",
                password: "pass"
            })
            signup.checkIfEmailIsValid()
            expect(mock.called).toBe(true)
        })
    })
    describe("#process", () => {
        it("should create user and send notification", () => {
            const data = {
                email: "john_doe@mail.com",
                password: "pass"
            }
            const sendNotification = sandbox.stub(Signup.prototype, "sendNotification").resolves()
            const checkIfEmailIsValid = sandbox.stub(Signup.prototype, "checkIfEmailIsValid").resolves()
            const signup = new Signup(data)
            return signup.process().then(async user => {
                expect(sendNotification.called).toBe(true)
                expect(checkIfEmailIsValid.called).toBe(true)
                const result = await db.User.findOne({where: {email: data.email}})
                expect(user.id).toEqual(result.id)
            })
        })
    })
})
