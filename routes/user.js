const express = require('express');
const router = express.Router();
const passport = require('passport');

const User=require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const { saveRedirectUrl } = require('../middleware.js');
const userController=require("../controllers/user.js")


router.route("/signup")
.get((req,res)=>{
    res.render("users/signup.ejs")
})
.post(wrapAsync(userController.signup));

router.route("/login")
.get((req,res)=>{
    res.render("users/login.ejs")
})
.post(saveRedirectUrl,
    passport.authenticate("local",
        {failureFlash:true,failureRedirect:"/login" }),
       userController.login)

router.get("/logout",userController.logout);


router.get("/login/listings",userController.yourlistings);

module.exports=router