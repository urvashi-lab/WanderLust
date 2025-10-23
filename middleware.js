const Listing=require("./models/listing.js");
const ExpressError=require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You need to login first!");
        return res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
const listing=await Listing.findById(id);
if (!res.locals.currentUser || !listing.owner.equals(res.locals.currentUser._id)) {
    req.flash("error","You don't have permission!!");
    return res.redirect(`/listings/${id}`);
}
next();
}

module.exports.isAuthor=async(req,res,next)=>{
  let {id,reviewId}=req.params;
  const myreview=await Review.findById(reviewId);
if (!myreview.author.equals(res.locals.currentUser._id)) {
  req.flash("error","You don't have permission!!");
  return res.redirect(`/listings/${id}`);
}
  next();


}

module.exports.validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body, { abortEarly: false });
    if(error){
      console.log(error);
      let errMsg=error.details.map((el)=>el.message).join(",")
      next(new ExpressError(400,errMsg));
    }
    else{
  next();
    }
  }

  module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body, { abortEarly: false });
    if(error){
      console.log(error);
      let errMsg=error.details.map((el)=>el.message).join(",");
      next(new ExpressError(400,errMsg));
    }
    else{
  next();
    }
  }

 