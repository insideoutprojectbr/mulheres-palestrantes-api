export default function(sequelize, DataTypes) {
    let Interest = sequelize.define("Interest",
        {
            name: {
                type: DataTypes.STRING(255),
                notEmpty: true,
                allowNull: false,
                unique: true,
            }
        },
        {
            underscored: true,
            timestamps: false,
            tableName: "interests"
        })

    return Interest
}
