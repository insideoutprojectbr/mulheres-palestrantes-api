export default function(sequelize, DataTypes) {
    let Speaker = sequelize.define("Speaker",
        {
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
                default: false
            },
            location: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            photo: {
                type: DataTypes.STRING(255),
                allowNull: true
            }
        },{
            underscored: true,
            tableName: "speakers",
            createdAt: "created_at",
            updatedAt: "updated_at"
        })

    Speaker.associate = function(models) {
        Speaker.belongsToMany(models.Interest, {through: "speakers_interests", foreignKey: "speaker_id"})
        Speaker.belongsToMany(models.SocialNetwork, {through: "speakers_social_networks", foreignKey: "social_network_id"})
    }

    return Speaker
}
