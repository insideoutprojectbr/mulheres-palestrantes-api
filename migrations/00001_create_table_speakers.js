const tableName = "speakers"

export default {
    up: function(query, DataTypes) {
        return query.createTable(tableName, {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: true,
                unique: true
            },
            published: {
                type: DataTypes.BOOLEAN,
                notEmpty: true,
                allowNull: false,
                default: false
            },
            created_at: {
                type: DataTypes.DATE,
            },
            updated_at: {
                type: DataTypes.DATE,
            }
        })
    },

    down: function(query) {
        return query.dropTable(tableName)
    }
}
