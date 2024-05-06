const config = require("config.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

// Initialize an empty object to store models
module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({
        host,
        port,
        user,
        password,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, {
        dialect: "mysql",
    });

    // Add sequelize and query method to db object
    db.sequelize = sequelize;
    db.query = async (sql, options) => {
        return await sequelize.query(sql, options);
    };

    // init models and add them to the exported db object
    const defineDetailServiceModel = require('../model/detail_service.model');
    const defineDoctorSpecializationModel = require('../model/doctor_specialization.model');
    const defineDoctorModel = require('../model/doctor.model');
    const defineExperenceModel = require('../model/experence.model');
    const defineSpecializationModel = require('../model/specialization.model');
    const definePositionModel = require('../model/position.model');
    const defineServiceModel = require('../model/service.model');
    const defineAccountModel = require('../model/account.model');



    // Assign models to the db object
    db.DetailService = defineDetailServiceModel(sequelize);
    db.DoctorSpecialization = defineDoctorSpecializationModel(sequelize);
    db.Doctor = defineDoctorModel(sequelize);
    db.Experence = defineExperenceModel(sequelize);
    db.Specialization = defineSpecializationModel(sequelize);
    db.Position = definePositionModel(sequelize);
    db.Service = defineServiceModel(sequelize);
    db.Account = defineAccountModel(sequelize);

    // sync all models with database
    await sequelize.sync({ alter: true });

}