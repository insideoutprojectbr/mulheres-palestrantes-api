const tableName = "social_networks"

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
                notEmpty: true,
                allowNull: false,
                unique: true
            },
            url: {
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
