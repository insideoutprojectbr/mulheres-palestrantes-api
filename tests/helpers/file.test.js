import Promise from "bluebird"
import sinon from "sinon"
import superagent from "superagent"
import {readFromFileOrUrl} from "../../helpers/file"

describe("readFromFileOrUrl", () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })
    afterEach(() => {
        sandbox.restore()
    })
    describe("path is valid file path", () => {
        it("should return file contents", () => {
            const mock = sandbox.stub(Promise, "promisifyAll").returns({
                readFileAsync(){
                    return "{}"
                }
            })
            return readFromFileOrUrl("/path/to/file").then(response => {
                expect(response).toEqual("{}")
                expect(mock.called).toBe(true)
            })
        })
    })
    describe("path is valid", () => {
        it("should return file contents", () => {
            const mock = sandbox.stub(superagent, "get").resolves({text: "{}"})
            return readFromFileOrUrl("/path/to/file").then(response => {
                expect(response).toEqual("{}")
                expect(mock.called).toBe(true)
            })
        })
    })
})
