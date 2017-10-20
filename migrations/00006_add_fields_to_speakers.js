import Promise from "bluebird"

const tableName = "speakers"

export default {
    up: function(query, DataTypes) {
        return Promise.all(
            query.addColumn(
                tableName,
                "location",
                {
                    type: DataTypes.STRING(255),
                    allowNull: true
                }),
            query.addColumn(
                tableName,
                "photo",
                {
                    type: DataTypes.STRING(255),
                    allowNull: true
                }),
            query.addColumn(
                tableName,
                "site",
                {
                    type: DataTypes.STRING(255),
                    allowNull: true
                }))
    },
    down: function(query) {
        return Promise.all(
            query.removeColumn(tableName, "location"),
            query.removeColumn(tableName, "photo"),
            query.removeColumn(tableName, "site"))
    }
}
