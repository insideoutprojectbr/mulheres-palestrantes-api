export default function(sequelize, DataTypes) {
    let SocialNetworkAccount = sequelize.define("SocialNetworkAccount",
        {
            username: {
                type: DataTypes.STRING(255),
                notEmpty: true,
                allowNull: false
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
            }
        },
        {
            underscored: true,
            tableName: "social_network_accounts",
            getterMethods: {
                socialNetworkUrl(){
                    return this.SocialNetwork.url.replace("username", this.getDataValue("username"))
                }
            }
        })

    SocialNetworkAccount.associate = function(models) {
        SocialNetworkAccount.belongsTo(models.Speaker)
        SocialNetworkAccount.belongsTo(models.SocialNetwork)
    }

    return SocialNetworkAccount
}
