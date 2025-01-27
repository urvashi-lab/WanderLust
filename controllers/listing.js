const Listing=require("../models/listing.js");

module.exports.index=async (req,res,next)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
 }

 module.exports.showlisting=async (req,res)=>{
    let {id}=req.params;
    const showlisting=await Listing.findById(id).populate({path:"reviews",
      populate:{
      path:"author",},
    }).populate("owner");
    if(!showlisting){
      req.flash("error","Your requested listing does not exist!!");
      res.redirect("/listings");
    }
    
     res.render("listings/show.ejs",{showlisting})
    }

    module.exports.newListing=async (req,res,next)=>{
      const { location } = req.body.listing;

      // Fetch coordinates from Nominatim API
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const geocodeData = await geocodeResponse.json();
  
      if (geocodeData.length > 0) {
        const lat = parseFloat(geocodeData[0].lat);
        const lon = parseFloat(geocodeData[0].lon);
     
                        
    
 let url=req.file.path;
 let filename=req.file.filename;
        const newlisting=new Listing(req.body.listing);
        newlisting.owner=req.user._id;
        newlisting.image={url,filename};
        newlisting.coordinates={
          lat,
          lon
      };
        await newlisting.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
      }
    }


    module.exports.renderEditPage=async (req,res)=>{
        let {id}=req.params;
      const yourlisting=await Listing.findById(id);
      if(!yourlisting){
        req.flash("error","Your requested listing does not exist!!");
        res.redirect("/listings");
      }
      let originalImageUrl=yourlisting.image.url;
      originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250")
        res.render("listings/edit.ejs",{yourlisting,originalImageUrl});
       }



       module.exports.editListing = async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
      
        // Check if the location has changed
        if (listing.location !== req.body.listing.location) {
          const { location } = req.body.listing;
      
          // Fetch coordinates from Nominatim API if the location has changed
          const geocodeResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
          );
          const geocodeData = await geocodeResponse.json();
      
          if (geocodeData.length > 0) {
            const lat = parseFloat(geocodeData[0].lat);
            const lon = parseFloat(geocodeData[0].lon);
      
            // Update the coordinates if location changed
            listing.coordinates = { lat, lon };
          } else {
            req.flash("error", "Location not found!");
            return res.redirect(`/listings/${id}/edit`);
          }
        }
      
        // Update the listing details
        listing = Object.assign(listing, req.body.listing);
      
        // Handle the image upload if available
        if (typeof req.file !== "undefined") {
          let url = req.file.path;
          let filename = req.file.filename;
          listing.image = { url, filename };
        }
      
        // Save the updated listing
        await listing.save();
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
      };
      
    


      module.exports.deleteListing=async (req,res)=>{
        let {id}=req.params;
      await Listing.findByIdAndDelete(id)
      req.flash("success","Listing Deleted!");
      res.redirect("/listings")
      }

      module.exports.category=async(req,res)=>{
        const {category} = req.query;
        let listings=await Listing.find({category:category})
        res.render("listings/category.ejs",{listings})
    }

    module.exports.search = async (req, res) => {
      const {location} = req.query; // Access location directly from req.query
      let listings = await Listing.find({ location: location }); // Find listings matching the location
      res.render("listings/search", { listings }); // Render the search results view
    };
    