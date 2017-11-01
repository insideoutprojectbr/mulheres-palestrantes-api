import db from "../models"
import {validateEmailExistence} from "./validators"

class Account {

    constructor(data){
        this.data = data
    }

    static async confirm(id){

    }

    async validate(){
        return validateEmailExistence(this.data.email)
    }

    async create(){
        try{
            await this.validate()
            const user = await db.User.create(this.data)
            return user
        } catch(error){
            throw error
        }
    }
}

export {Account}
