const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin123",
    database: "db_jwtbootcamp",
    dialect: "postgres",
});

module.exports = sequelize;
