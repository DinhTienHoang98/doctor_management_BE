const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Experence = sequelize.define(
        "Experience",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            doctor_id: {
                type: DataTypes.INTEGER,
            },
            code: {
                type: DataTypes.STRING(10),
            },
            value: {
                type: DataTypes.STRING(1000),
            },
        },
        {
            timestamps: false, // Disable timestamps
        }
    );

    return Experence;
};