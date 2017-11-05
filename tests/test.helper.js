import {passport} from "../auth/middleware"
import factory from "./factories"


function mockJWTMiddleware(sandbox, user=null){
    return sandbox.stub(passport, "authenticate").returns(
        async (ctx, next) => {
            ctx.state = {
                user: user ? user : await factory.build("User", {id: 1})
            }
            await next()
        }
    )
}

export {mockJWTMiddleware}
