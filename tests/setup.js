import db from "../models"

beforeEach((done) => {
    db.sequelize.sync({force: true}).then(() => done())
})
