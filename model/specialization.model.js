const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const specialization = sequelize.define(
        "specialization",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            code: {
                type: DataTypes.STRING(10),
            },
            description: {
                type: DataTypes.STRING(1000),
            },
        },
        {
            timestamps: false, // Disable timestamps
        }
    );

    return specialization;
};