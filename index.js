const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

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
            res.render("index", {articles: articles,
                                 categories: categories});
        });
    });
})


app.get("/", (req, res) => {
    RegularArticle.findAll({
        order:[
            ['id','DESC']
        ],
        limit: 4
    }).then(regulararticles => {
        RegularCategory.findAll().then(regularcategories => {
            res.render("index", {regulararticles: regulararticles,
                                 regularcategories: regularcategories});
        });
    });
})

app.get("/:slug",(req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    });
})

app.get("/:slug",(req, res) => {
    var slug = req.params.slug;
    RegularArticle.findOne({
        where: {
            slug: slug
        }
    }).then(regulararticle => {
        if(regulararticle != undefined){
            RegularCategory.findAll().then(regularcategories => {
                res.render("regulararticle", {regulararticle: regulararticle,
                                              regularcategories: regularcategories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    });
})


app.get("/category/:slug",(req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index",{articles: category.articles,categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    })
})

app.get("/regularcategory/:slug",(req, res) => {
    var slug = req.params.slug;
    RegularCategory.findOne({
        where: {
            slug: slug
        },
        include: [{model: RegularArticle}]
    }).then( regularcategory => {
        if(regularcategory != undefined){
            RegularCategory.findAll().then(regularcategories => {
                res.render("index",{regulararticles: regularcategory.regulararticles,regularcategories: regularcategories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    })
})

app.listen(3000, () => {
    console.log("O servidor está rodando!")
})