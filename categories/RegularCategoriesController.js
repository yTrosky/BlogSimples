const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

router.get("/regularusers/categories/new",(req, res) => {
    res.render("regularusers/categories/new");
});

router.post("/categories/save", (req, res) => {
    var title = req.body.title;
    if(title != undefined){
        
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/regularusers/categories");
        })

    }else{
        res.redirect("/regularusers/categories/new");
    }
});

router.get("/regularusers/categories",  (req, res) => {
    Category.findAll().then(categories => {
        res.render("regularusers/categories/index", {categories: categories});
    });
});

router.post("/categories/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/regularusers/categories");
            });
        }else{// NÃO FOR UM NÚMERO
            res.redirect("/regularusers/categories");
        }
    }else{ // NULL
        res.redirect("/regularusers/categories");
    }
});

router.get("/regularusers/categories/edit/:id", (req, res) => {
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/regularusers/categories"); 
    }

    Category.findByPk(id).then(category => {
        if(category != undefined){
            res.render("regularusers/categories/edit",{category: category});
        }else{
            res.redirect("/regularusers/categories");
        }
    }).catch(erro => {
        res.redirect("/regularusers/categories");        
    })
});

router.post("/categories/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update({title: title, slug: slugify(title) },{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/regularusers/categories");    
    })

});

module.exports = router;