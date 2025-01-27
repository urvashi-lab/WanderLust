const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");

const categories=["Greenary","Beaches","Forests","Amazing pools","Top cities","Rooms","Mountains","Camping","Farms","Artic","Trending","History","Lakefront"];
const listingSchema=new Schema({
    title:{
    type:String,
    
    },
    description:String,
    image:{
        filename:String,
        url:{
    type:String,
    default:"https://images.unsplash.com/photo-1533253386197-6b67a7238177?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set: function (v) {
        return v === "" 
            ? "https://images.unsplash.com/photo-1533253386197-6b67a7238177?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            : v;
    }
    }
    },
    price:{
    type:Number,
    required:true
},
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:
        {
            type:Schema.Types.ObjectId,
            ref:"User",
        },
        coordinates: {
            lat: { type: Number, required: true },
            lon: { type: Number, required: true },
          },      
    category:
    {
        type:String,
        enum:categories
    }
});

// listingSchema.post("findOneAndDelete",async(listing)=>{
//     await Review.deleteMany({_id:{$in:listing.reviews}});
// });

const Listing=mongoose.model("Listing",listingSchema)
module.exports=Listing;
