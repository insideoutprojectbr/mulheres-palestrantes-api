import sinon from "sinon"
import * as validators from "../../accounts/validators"
import {Account} from "../../accounts/actions"
import db from "../../models"

describe("Account", () => {
    let sandbox
    beforeEach(async () => {
        sandbox = sinon.sandbox.create()
    })
    afterEach(() => {
        sandbox.restore()
    })
    describe("#create", () => {
        it("should create user account", async () => {
            const mock = sandbox.stub(validators, "validateEmailExistence").resolves()
            const data = {
                email: "john_doe@mail.com",
                password: "pass"
            }
            const account = new Account(data)
            const user = await account.create()
            const result = await db.User.findOne({where: {email: data.email}})
            expect(user.id).toEqual(result.id)
            expect(mock.calledWith(data.email)).toBe(true)
        })
    })
})
