const Sequelize = require("sequelize");
const connection = require("../database/database");
const RegularCategory = require("../categories/RegularCategory");

const RegularArticle = connection.define('regulararticles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

RegularCategory.hasMany(RegularArticle); // UMA Categoria tem muitos artigos
RegularArticle.belongsTo(RegularCategory); // UM Artigo pertence a uma categoria

module.exports = RegularArticle;