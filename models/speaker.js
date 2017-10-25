import Promise from "bluebird"
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
                }
            },
            scopes: {
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

    Speaker.findByQuery = function(query){
        return this.scope({method: ["searchable", query]}).findAll()
    }

    Speaker.prototype.groupSocialNetworksByName = async function(){
        const accounts = await this.fetchAssociation("SocialNetworkAccounts", {
            include: [sequelize.models.SocialNetwork]
        })
        const urls = await Promise.map(accounts, account => account.getSocialNetworkUrl().then(url =>
            ({[account.SocialNetwork.name]: url})))
        return Object.assign({}, ...urls)
    }

    Speaker.prototype.getInterestList = async function(){
        const list = await this.fetchAssociation("Interests")
        return list.map(interest => interest.name)
    }

    Speaker.prototype.getFullInfo = function(){
        return Promise.join(
            this.getInterestList(),
            this.groupSocialNetworksByName(),
            (interests, social_networks) => {
                const data = {
                    id: this.id,
                    name: this.name,
                    email: this.email,
                    location: this.location,
                    photo : this.image,
                    site: this.site,
                    interests: interests
                }
                return Promise.resolve(Object.assign(data, social_networks))
            })
    }

    return Speaker
}
