import fs from "fs"
import path from "path"
import Sequelize from "sequelize"
import config from "../config"

const sequelize = new Sequelize(config.DATABASE_URL, {logging: false})

let db = {}

fs.readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js")
    }).forEach(function(file) {
        let model = sequelize.import(path.join(__dirname, file))
        db[model.name] = model
    })

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db)
        db[modelName].prototype.fetchAssociation = function(name, options={}){
            return this[name] ? Promise.resolve(this[name]) : this[`get${name}`](options)
        }
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
