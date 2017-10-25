import db from "../models"

beforeEach((done) => {
    db.sequelize.sync({force: true, logging: false}).then(() => done())
})
