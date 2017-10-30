import sinon from "sinon"
import gravatar from "gravatar"
import {generateGravatarUrl} from "../../helpers/image"
import config from "../../config"

describe("generateGravatarUrl", () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })
    afterEach(() => {
        sandbox.restore()
    })
    it("should return file contents", () => {
        const mock = sandbox.stub(gravatar, "url").returns("")
        sandbox.stub(config, "PLACEHOLDER_URL").value("http://image.com/img.png")
        const options = {
            size: "40",
            rating: "pg",
            default: config.PLACEHOLDER_URL
        }
        generateGravatarUrl("john_doe@email.com")
        expect(mock.calledWith("john_doe@email.com", options)).toBe(true)
    })
})
