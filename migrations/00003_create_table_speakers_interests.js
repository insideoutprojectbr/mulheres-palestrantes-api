const tableName = "speakers_interests"

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
            interest_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "interests",
                    key: "id"
                }
            },
            created_at: {
                type: DataTypes.DATE,
            },
            updated_at: {
                type: DataTypes.DATE,
            },
        },{
            underscored: true
        })
    },
    down: function(query) {
        return query.dropTable(tableName)
    }
}
