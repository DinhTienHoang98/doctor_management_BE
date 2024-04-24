const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Service = sequelize.define(
        "Service",
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

    return Service;
};