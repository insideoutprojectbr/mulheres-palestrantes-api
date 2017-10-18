export default function(sequelize, DataTypes) {
    let Speaker = sequelize.define("Speaker",
        {
            name: {
                type: DataTypes.STRING(255),
                notEmpty: true,
                allowNull: false,
                unique: true
            },
            email: {
                type: DataTypes.STRING(255),
                notEmpty: true,
                allowNull: false,
                unique: true
            },
            published: {
                type: DataTypes.BOOLEAN,
                notEmpty: true,
                allowNull: false,
                default: false
            },
            underscored: true,
            tableName: "speakers",
            createdAt: "created_at",
            updatedAt: "updated_at"
        })

    Speaker.associate = function(models) {
        Speaker.belongsToMany(models.Interest, {through: "speakers_interests", foreignKey: "speaker_id"})
        Speaker.belongsToMany(models.SocialNetwork, {through: "speakers_social_networks", foreignKey: "speaker_id"})
    }

    return Speaker
}
