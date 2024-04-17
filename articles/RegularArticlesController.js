const express = require("express");
const router = express.Router();
const RegularCategory = require("../categories/RegularCategory");
const RegularArticle = require("./RegularArticle");
const slugify = require("slugify");
const regularuserAuth = require("../middlewares/regularuserAuth");

router.get("/regularusers/articles", regularuserAuth ,(req, res) => {
    RegularArticle.findAll({
        include: [{model: RegularCategory}]
    }).then(regulararticles => {
        res.render("regularusers/articles/index",{regulararticles: regulararticles})
    });
});

router.get("/regularusers/articles/new", regularuserAuth ,(req ,res) => {
    RegularCategory.findAll().then(regularcategories => {
        res.render("regularusers/articles/new",{regularcategories: regularcategories})
    })    
})

router.post("/regulararticles/save", regularuserAuth, (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var regularcategory = req.body.regularcategory;

    RegularArticle.create({
        title: title,
        slug: slugify(title),
        body: body,
        regularcategoryId: regularcategory
    }).then(() => {
        res.redirect("/regularusers/articles");
    });
});


router.post("/regulararticles/delete", regularuserAuth , (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            RegularArticle.destroy({
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

router.get("/regularusers/articles/edit/:id", regularuserAuth , (req, res) => {
    var id = req.params.id;
    RegularArticle.findByPk(id).then(regulararticle => {
        if(regulararticle != undefined){
            Category.findAll().then(regularcategories => {
                res.render("regularusers/articles/edit", {regularcategories: regularcategories, regulararticle: regulararticle})

            });
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

router.post("/regulararticles/update", regularuserAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var regularcategory = req.body.regularcategory

    RegularArticle.update({title: title, body: body, categoryId: regularcategory, slug:slugify(title)},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/regularusers/articles");
    }).catch(err => {
        res.redirect("/");
    });
});

router.get("/regulararticles/page/:num",(req, res) => {
    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page) - 1) * 4;
    }

    RegularArticle.findAndCountAll({
        limit: 4,
        offset: offset,
    }).then(regulararticles => {
        var next;
        if(offset + 4 >= regulararticles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            regulararticles : regulararticles
        }

        RegularCategory.findAll().then(regularcategories => {
            res.render("regularusers/articles/page",{result: result, regularcategories: regularcategories})
        });
    })


});

module.exports = router;