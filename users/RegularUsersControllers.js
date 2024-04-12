const express = require("express");
const router = express.Router();
const Regularusers = require("./RegularUser");
const bcrypt = require('bcryptjs');

router.get("regularusers/users", (req, res) => {
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
    
    Regularusers.findOne({where:{email: email}}).then( user => {
        if(user == undefined){

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

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/authenticate", (req, res) => {

    var email = req.body.email;
    var password = req.body.password;

    Regularusers.findOne({where:{email: email}}).then(user => {
        if(user != undefined){ // Se existe um usuário com esse e-mail
            // Validar senha
            var correct = bcrypt.compareSync(password,user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("regularusers/users/articles");
            }else{
                res.redirect("/login"); 
            }

        }else{
            res.redirect("/login");
        }
    });

});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
})


module.exports = router;