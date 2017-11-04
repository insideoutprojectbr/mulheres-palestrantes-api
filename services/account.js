import db from "../models"

class Account {

    constructor(data){
        this.data = data
    }
    async create(){
        try{
            const user = await db.User.create(this.data)
            return user
        } catch(error){
            throw error
        }
    }
}

export {Account}
