import sinon from "sinon"
import sgMail from "@sendgrid/mail"
import factory from "../factories"
import config from "../../config"
import {AccountConfirmationMailer} from "../../mailers"

describe("AccountConfirmationMailer", () => {
    let sandbox
    let user
    beforeEach(async () => {
        sandbox = sinon.sandbox.create()
        sandbox.stub(config, "EMAIL_CONFIRMATION_URL").value("http://url.com")
        sandbox.stub(config, "SENDGRID_EMAIL_FROM").value("from@email.com")
        user = await factory.create("User", {id: 1, confirmation_key: "random"})
    })
    afterEach(() => {
        sandbox.restore()
    })
    describe("#send", () => {
        it("it should call sendGrid service", async () => {
            const mock = sandbox.stub(sgMail, "send").resolves()
            const mail = new AccountConfirmationMailer(user)
            await mail.send()
            expect(mock.called).toBe(true)
        })
    })
})
