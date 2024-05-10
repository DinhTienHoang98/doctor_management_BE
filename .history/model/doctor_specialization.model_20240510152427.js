const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Doctor_specialization = sequelize.define(
        "Doctor_specialization",
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

    return Doctor_specialization;
};