const tableName = "speakers"

export default {
    up: function(query, DataTypes) {
        return query.addColumn(tableName, "user_id", {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id"
            }
        })
    },
    down: function(query) {
        return query.removeColumn(tableName, "user_id")
    }
}
