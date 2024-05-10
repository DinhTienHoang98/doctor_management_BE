const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const doctor_specialization = sequelize.define(
        "doctor_specialization",
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
            specialization_id: {
                type: DataTypes.INTEGER,
            },
        },
        {
            timestamps: false, // Disable timestamps
        }
    );

    return doctor_specialization;
};