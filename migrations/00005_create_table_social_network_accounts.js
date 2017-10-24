const tableName = "social_network_accounts"

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
            },
            username: {
                type: DataTypes.STRING(255),
                notEmpty: true,
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
            },
            updated_at: {
                type: DataTypes.DATE,
            }
        },{
            underscored: true
        })
    },
    down: function(query) {
        return query.dropTable(tableName)
    }
}
