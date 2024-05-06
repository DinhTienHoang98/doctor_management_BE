const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Doctor = sequelize.define(
        "Doctor",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            fullname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            workplace: {
                type: DataTypes.STRING(255),
            },
            birth_year: {
                type: DataTypes.INTEGER(4),
            },
            introduce: {
                type: DataTypes.STRING(255),
            },
            training_process: {
                type: DataTypes.STRING(8000),
            },
            gender: {
                type: DataTypes.STRING(10),
            },
            phone_number: {
                type: DataTypes.S(11),
            },
        },
        {
            timestamps: false, // Disable timestamps
        }
    );

    return Doctor;
};