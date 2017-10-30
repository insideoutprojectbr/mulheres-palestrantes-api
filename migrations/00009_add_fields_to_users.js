import Promise from "bluebird"

const tableName = "users"

export default {
    up: function(query, DataTypes) {
        return Promise.all(
            query.addColumn(tableName, "confirmation_key", {
                type: DataTypes.STRING(255),
                allowNull: false
            }),
            query.addColumn(tableName, "confirmation_date", {
                type: DataTypes.DATE,
                allowNull: true
            })
        )
    },
    down: function(query) {
        return Promise.all(
            query.removeColumn(tableName, "confirmation_key"),
            query.removeColumn(tableName, "confirmation_date")
        )
    }
}
