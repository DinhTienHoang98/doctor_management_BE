const { number } = require("joi");
const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Account = sequelize.define(
        "Account",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            role: {
                type: DataTypes.STRING,
            },
            user_name: {
                type: DataTypes.STRING,
            },
            password: {
                type: DataTypes.STRING,
            },
            otp_code: {
                type: DataTypes.STRING
            },
            gmail: {
                type
            }
        },
        {
            timestamps: false, // Disable timestamps
        }
    );

    return Account;
};