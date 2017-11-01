import sinon from "sinon"
import mailConfirm from "mail-confirm"
import {validateEmailExistence} from "../../accounts/validators"

describe("#validateEmailExistence", () => {
    let sandbox
    beforeEach(async () => {
        sandbox = sinon.sandbox.create()
    })
    afterEach(() => {
        sandbox.restore()
    })

    it("should validate email address", async () => {
        const mock = sandbox.stub(mailConfirm.prototype, "check").resolves()
        await validateEmailExistence("john_doe@mail.com")
        expect(mock.called).toBe(true)
    })
})
