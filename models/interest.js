export default function(sequelize, DataTypes) {
    let Interest = sequelize.define("Interest",
        {
            name: {
                type: DataTypes.STRING(255),
                notEmpty: true,
                allowNull: false,
                unique: true
            }
        },
        {
            underscored: true,
            timestamps: false,
            tableName: "interests"
        })

    Interest.associate = function(models) {
        Interest.belongsToMany(models.Speaker, {through: "speakers_interests", foreignKey: "interest_id"})
    }

    return Interest
}
