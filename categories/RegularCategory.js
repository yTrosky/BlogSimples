const Sequelize = require("sequelize");
const connection = require("../database/database");

const RegularCategory = connection.define('regularcategories',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = RegularCategory;
