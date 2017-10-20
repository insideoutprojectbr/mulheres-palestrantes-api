export default function(sequelize, DataTypes) {
    let SocialNetwork = sequelize.define("SocialNetwork",
        {
            name: {
                type: DataTypes.STRING(255),
                notEmpty: true,
                allowNull: false,
                unique: true
            },
        },
        {
            underscored: true,
            tableName: "social_networks"
        })

    SocialNetwork.associate = function(models) {
        SocialNetwork.belongsToMany(models.Speaker, {through: "speakers_social_networks", foreignKey: "social_network_id"})
    }

    return SocialNetwork
}
