function regularusersAuth(req, res, next){
    if(req.session.regularusers != undefined){
        next();
    }else{
        res.redirect("/regularlogin");
    }
 }
 module.exports = regularusersAuth