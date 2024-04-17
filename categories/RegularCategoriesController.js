const express = require("express");
const router = express.Router();
const RegularCategory = require("./RegularCategory");
const slugify = require("slugify");

router.get("/regularusers/categories/new",(req, res) => {
    res.render("regularusers/categories/new");
});

router.post("/regularcategories/save", (req, res) => {
    var title = req.body.title;
    if(title != undefined){
        
        RegularCategory.create({
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
    RegularCategory.findAll().then(regularcategories => {
        res.render("regularusers/categories/index", {regularcategories: regularcategories});
    });
});

router.post("/regularcategories/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            RegularCategory.destroy({
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

    RegularCategory.findByPk(id).then(regularcategory => {
        if(regularcategory != undefined){
            res.render("regularusers/categories/edit",{regularcategory: regularcategory});
        }else{
            res.redirect("/regularusers/categories");
        }
    }).catch(erro => {
        res.redirect("/regularusers/categories");        
    })
});

router.post("/regularcategories/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    RegularCategory.update({title: title, slug: slugify(title) },{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/regularusers/categories");    
    })

});

module.exports = router;