const sequelize = require('../config/db.config');
const { DataTypes } = require('sequelize');
const Bootcamp = require('./bootcamp.model')

const User = sequelize.define('user', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Bootcamp.belongsToMany(User, {
    through: 'user_bootcamp'
});

User.belongsToMany(Bootcamp, {
    through: 'user_bootcamp'
});

module.exports = User;