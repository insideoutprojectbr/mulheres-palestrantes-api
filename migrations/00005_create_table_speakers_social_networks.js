const tableName = "speaker_social_networks"

export default {
    up: function(query, DataTypes) {
        return query.createTable(tableName, {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            speaker_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "speakers",
                    key: "id"
                }
            },
            social_network_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "social_networks",
                    key: "id"
                }
            }
        })
    },
    down: function(query) {
        return query.dropTable(tableName)
    }
}
