const express = require("express");
const router = express.Router();
const Regularusers = require("./RegularUser");
const bcrypt = require('bcryptjs');
const regularuserAuth = require("../middlewares/regularuserAuth");

router.get("/regularusers/users", (req, res) => {
    Regularusers.findAll().then(regularusers => {
        res.render("regularusers/users/index",{regularusers: regularusers});
    });
});

router.get("/regularusers/create", (req, res) => {
    res.render("./regularusers/users/regularcreate");
});

router.post("/regularusers/create", (req, res) => {
    var name = req.body.name;
    var age = req.body.age;
    var address = req.body.address;
    var email = req.body.email;
    var password = req.body.password;
    
    Regularusers.findOne({where:{email: email}}).then( regularusers => {
        if(regularusers == undefined){

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            
            Regularusers.create({
                name: name,
                age: age,
                address: address,
                email: email,
                password: hash,
            }).then(() => {
                res.redirect("/");
            }).catch((err) => {
                res.send("Houve um erro: " + err);
            });

        }else{
            res.redirect("/regularusers/create");
        }
    });
});

router.post("/regularusers/regulardelete",(req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Regularusers.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/users");
            });
        }else{// NÃO FOR UM NÚMERO
            res.redirect("/admin/users");
        }
    }else{ // NULL
        res.redirect("/admin/users");
    }
});

router.get("/regularusers/regularlogin", (req, res) => {
    res.render("regularusers/users/regularlogin");
});


router.post("/regularusers/regularauthenticate", (req, res) => {

    var email = req.body.email;
    var password = req.body.password;

    Regularusers.findOne({where:{email: email}}).then(regularusers => {
        if(regularusers != undefined){ // Se existe um usuário com esse e-mail
            // Validar senha
            var correct = bcrypt.compareSync(password,regularusers.password);

            if(correct){
                req.session.regularusers = {
                    id: regularusers.id,
                    email: regularusers.email
                }
                res.redirect("/regularusers/articles");
            }else{
                res.redirect("/regularlogin"); 
            }
        } else {
            return res.redirect("/regularlogin");
        }
    }).catch((err) => {
        res.send("Houve um erro: " + err);
    });
});


router.get("/logout", (req, res) => {
    req.session.regularusers = undefined;
    res.redirect("/");
})


module.exports = router;
