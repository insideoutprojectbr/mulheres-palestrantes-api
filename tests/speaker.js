import {generateGravatarUrl} from "../utils/image"

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
            },
            site: {
                type: DataTypes.STRING(255),
                allowNull: true
            }
        },{
            underscored: true,
            tableName: "speakers",
            createdAt: "created_at",
            updatedAt: "updated_at",
            getterMethods: {
                image(){
                    return this.getDataValue("photo") || generateGravatarUrl(this.getDataValue("email"))
                },
                socialNetworksByName(){
                    return this.SocialNetworkAccounts.reduce((result, account) => Object.assign(result,
                        {
                            [account.SocialNetwork.name]: account.socialNetworkUrl
                        }), {})
                }
            },
            scopes: {
                defaultScope: {
                    include: [{
                        model: sequelize.models.SocialNetworkAccount,
                        include: [sequelize.models.SocialNetwork]
                    }]
                },
                searchable: function(query){
                    const Sequelize = sequelize.Sequelize
                    let filter = {}
                    const iLikeFilter = {
                        [Sequelize.Op.iLike]: `%${query}%`
                    }
                    if (query){
                        filter = {
                            $or: {
                                name: iLikeFilter,
                                location: iLikeFilter,
                                "$Interests.name$": iLikeFilter
                            }
                        }
                    }
                    return  {
                        include: [{
                            model: sequelize.models.Interest
                        },
                        {
                            model: sequelize.models.SocialNetworkAccount,
                            include: [sequelize.models.SocialNetwork]
                        }],
                        where: Object.assign({
                            published: true,
                        }, filter)
                    }
                }
            }
        })

    Speaker.associate = function(models) {
        Speaker.belongsToMany(models.Interest, {
            through: "speakers_interests",
            foreignKey: "speaker_id",
            otherKey: "interest_id"
        })
        Speaker.hasMany(models.SocialNetworkAccount)
        Speaker.belongsToMany(models.SocialNetwork, {
            through: models.SocialNetworkAccount,
        })
    }

    return Speaker
}
