import config from "../config"
import {generateSalt, generatePassword, verifyPassword, generateConfirmationKey} from "../helpers/account"

export default function(sequelize, DataTypes) {
    let User = sequelize.define("User",
        {
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
                allowNull: false,
                defaultValue: generateSalt
            },
            password: {
                type: DataTypes.VIRTUAL,
                set: function (val) {
                    this.setDataValue("password", val)
                    this.setDataValue("password_hash", generatePassword(val, this.password_hash))
                }
            },
            confirmation_key: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: generateConfirmationKey
            },
            confirmation_date: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },{
            underscored: true,
            tableName: "users",
            createdAt: "created_at",
            updatedAt: "updated_at",
            getterMethods: {
                account_confirmation_url(){
                    return `${config.EMAIL_CONFIRMATION_URL}/accounts/${this.id}/confirmation?key=${this.confirmation_key}`
                }
            },
            scopes: {
                active: function(){
                    const Op = sequelize.Sequelize.Op
                    return {
                        where: {
                            confirmation_date: {
                                [Op.not]: null
                            }
                        }
                    }
                }
            }
        })

    User.associate = function(models) {
        User.hasOne(models.Speaker)
    }

    User.prototype.verifyPassword = function (password){
        return verifyPassword(password, this.password_hash)
    }

    User.prototype.confirm = async function (key){
        if (!Object.is(key, this.confirmation_key) || Object.is(key, null)){
            throw new Error("Invalid confirmation key")
        }
        if (this.confirmation_date){
            throw new Error("Account was already confirmed")
        }
        this.confirmation_date = new Date()
        return this.save()
    }

    return User
}
