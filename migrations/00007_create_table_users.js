const tableName = "users"
export default {
    up: function(query, DataTypes) {
        return query.createTable(tableName, {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: DataTypes.STRING(255),
                notEmpty: true,
                allowNull: false,
                unique: true
            },
            password_hash: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            password_salt: {
                type: DataTypes.STRING(255),
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
