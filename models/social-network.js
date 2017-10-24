export default function(sequelize, DataTypes) {
    let SocialNetwork = sequelize.define("SocialNetwork",
        {
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
            }
        },
        {
            underscored: true,
            tableName: "social_networks",
        })

    SocialNetwork.associate = function(models) {
        SocialNetwork.hasMany(models.SocialNetworkAccount)
    }

    return SocialNetwork
}
