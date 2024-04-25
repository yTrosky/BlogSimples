const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");
const path = require('path');

const categoriesController = require("./categories/CategoriesController");
const regularCategoriesController = require("./categories/RegularCategoriesController");
const articlesController = require("./articles/ArticlesController");
const regularArticlesController = require("./articles/RegularArticlesController");
const usersController = require("./users/UsersController");
const regularUsersController = require("./users/RegularUsersControllers");

const Article = require("./articles/Article");
const RegularArticle = require("./articles/RegularArticle");
const Category = require("./categories/Category");
const RegularCategory = require("./categories/RegularCategory");
const User = require("./users/User");
const RegularUsers = require("./users/RegularUser");

// View engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

// Sessions

app.use(session({
    secret: "quaquercoisas", cookie: { maxAge: 30000000 }
}))

// Static
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso!");
    }).catch((error) => {
        console.log(error);
    })


app.use("/",categoriesController);   
app.use("/",regularCategoriesController); 
app.use("/",articlesController);
app.use("/",regularArticlesController);
app.use("/",usersController);
app.use("/",regularUsersController);


app.get("/", (req, res) => {
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            RegularArticle.findAll({
                order:[
                    ['id','DESC']
                ],
                limit: 4
            }).then(regulararticles => {
                RegularCategory.findAll().then(regularcategories => {
                    res.render("index", {
                        articles: articles,
                        categories: categories,
                        regulararticles: regulararticles,
                        regularcategories: regularcategories
                    });
                });
            });
        });
    });
});

app.get("/:slug", async (req, res) => {
    var slug = req.params.slug;

    try {
        const article = await Article.findOne({
            where: {
                slug: slug
            }
        });

        if(article != undefined){
            const categories = await Category.findAll();
            return res.render("article", {article: article, categories: categories});
        }

        const regulararticle = await RegularArticle.findOne({
            where: {
                slug: slug
            }
        });

        if(regulararticle != undefined){
            const regularcategories = await RegularCategory.findAll();
            return res.render("regulararticle", {regulararticle: regulararticle, regularcategories: regularcategories});
        }

        res.redirect("/");
    } catch (error) {
        // Trate o erro aqui
        console.error(error);
        res.redirect("/");
    }
});

app.get("/:type/:slug", async (req, res) => {
    var type = req.params.type;
    var slug = req.params.slug;

    try {
        if(type === "category") {
            const category = await Category.findOne({
                where: {
                    slug: slug
                },
                include: [{model: Article}]
            });

            if(category != undefined){
                const categories = await Category.findAll();
                return res.render("index",{articles: category.articles, categories: categories});
            }
        } else if(type === "regularcategory") {
            const regularcategory = await RegularCategory.findOne({
                where: {
                    slug: slug
                },
                include: [{model: RegularArticle}]
            });

            if(regularcategory != undefined){
                const regularcategories = await RegularCategory.findAll();
                return res.render("index",{regulararticles: regularcategory.regulararticles, regularcategories: regularcategories});
            }
        }

        res.redirect("/");
    } catch (error) {
        // Trate o erro aqui
        console.error(error);
        res.redirect("/");
    }
});

app.listen(3000, () => {
    console.log("O servidor está rodando!")
})