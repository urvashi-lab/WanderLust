
const User=require("../models/user.js");
const Listing=require("../models/listing.js");

module.exports.signup=async(req,res)=>{
    
        let {username,email,password}=req.body;
        const newUser=new User({
            username,
            email
        });
        let registeredUser=await User.register(newUser,password);
        console.log(registeredUser)
        req.login(registeredUser,(err)=>{
            if(err){
              return next(err);
            }
            req.flash("success","Welcome to wanderlust!");
            res.redirect("/listings");
            })
        } 

module.exports.login= async(req,res)=>{
    req.flash("success","Welcome Back to Wanderlust!!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    console.log("Redirecting to:", redirectUrl);
    res.redirect(redirectUrl);
    }

    module.exports.logout=(req,res,next)=>{
        req.logout((err)=>{
            if(err){
            next(err);
            }
            req.flash("success","You have logged out!!");
        res.redirect("/listings");
        });
        
    }   
    
    module.exports.yourlistings=async(req,res)=>{
        if (!req.user || !req.user._id) {
            return res.status(401).send('User not authenticated');
        }

        // Await the result of the query
        const yourlistings = await Listing.find({ owner: req.user._id });

        // Log the result
        console.log(yourlistings);
        res.render('listings/yourlistings.ejs', { listings: yourlistings });
    }