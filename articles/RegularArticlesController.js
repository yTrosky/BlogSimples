const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const regularusersAuth = require("../middlewares/regularusersAuth");

router.get("/regularusers/articles", regularusersAuth ,(req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("regularusers/articles/index",{articles: articles})
    });
});

router.get("/regularusers/articles/new", regularusersAuth ,(req ,res) => {
    Category.findAll().then(categories => {
        res.render("regularusers/articles/new",{categories: categories})
    })    
})

router.post("/articles/save", regularusersAuth, (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/regularusers/articles");
    });
});


router.post("/articles/delete", reguarusersAuth , (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/regularusers/articles");
            });
        }else{// NÃO FOR UM NÚMERO
            res.redirect("/regularusers/articles");
        }
    }else{ // NULL
        res.redirect("/regularusers/articles");
    }
});

router.get("/regularusers/articles/edit/:id", adminAuth , (req, res) => {
    var id = req.params.id;
    Article.findByPk(id).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("regularusers/articles/edit", {categories: categories, article: article})

            });
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

router.post("/articles/update", adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category

    Article.update({title: title, body: body, categoryId: category, slug:slugify(title)},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/regularusers/articles");
    }).catch(err => {
        res.redirect("/");
    });
});

router.get("/articles/page/:num",(req, res) => {
    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page) - 1) * 4;
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
    }).then(articles => {
        var next;
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles : articles
        }

        Category.findAll().then(categories => {
            res.render("regularusers/articles/page",{result: result, categories: categories})
        });
    })


});

module.exports = router;