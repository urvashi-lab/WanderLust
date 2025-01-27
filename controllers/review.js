const Review = require("../models/review.js");
const Listing=require("../models/listing.js");
module.exports.createReview=async (req,res)=>{
    
    let {id}=req.params;
    let newReview=new Review(
      req.body.review
    );
    listing=await Listing.findById(id);
    newReview.author=req.user._id;
    await newReview.save();
    listing.reviews.push(newReview);
    
    await listing.save(); 
    req.flash("success","Review Saved!");
    res.redirect(`/listings/${id}`);
  }

 module.exports.deleteReview=async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
  } 