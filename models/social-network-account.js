export default function(sequelize, DataTypes) {
    let SocialNetworkAccount = sequelize.define("SocialNetworkAccount",
        {
            username: {
                type: DataTypes.STRING(255),
                notEmpty: true,
                allowNull: false
            },
        },
        {
            underscored: true,
            tableName: "social_network_accounts"
        })

    SocialNetworkAccount.associate = function(models) {
        SocialNetworkAccount.belongsTo(models.Speaker)
        SocialNetworkAccount.belongsTo(models.SocialNetwork)
    }

    return SocialNetworkAccount
}
