const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Detail_service = sequelize.define(
        "Detail_service",
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
            service_id: {
                type: DataTypes.INTEGER,
            },
        },
        {
            timestamps: false, // Disable timestamps
        }
    );

    return Detail_service;
};