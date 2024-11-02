const sequelize = require('../config/db.config');
const { DataTypes } = require('sequelize');

const Bootcamp = sequelize.define('bootcamp', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 5,
            max: 20,
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

module.exports = Bootcamp;