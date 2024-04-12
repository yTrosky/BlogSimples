const Sequelize = require("sequelize");
const connection = require("../database/database");

const Regularusers = connection.define('regularusers',{
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },age: {
        type: Sequelize.INTEGER,
        allowNull: false
    },address:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Regularusers