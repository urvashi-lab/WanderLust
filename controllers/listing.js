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

    module.exports.newListing = async (req, res, next) => {
      console.log("============ NEW LISTING REQUEST START ============");
      console.log("1. Request received at:", new Date().toISOString());
      console.log("2. Request body:", JSON.stringify(req.body, null, 2));
      console.log("3. File info:", req.file ? {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        filename: req.file.filename
      } : "NO FILE");
      console.log("4. User ID:", req.user?._id);

      try {
        // CHECK 1: Validate request body
        if (!req.body.listing) {
          console.error("❌ FAIL: No listing in request body");
          throw new Error("Listing data is missing");
        }

        const { location } = req.body.listing;
        console.log("5. Location extracted:", location);

        if (!location) {
          console.error("❌ FAIL: No location provided");
          throw new Error("Location is required");
        }

        // CHECK 2: Validate file upload
        if (!req.file) {
          console.error("❌ FAIL: No file uploaded");
          throw new Error("Image is required");
        }
        console.log("6. ✅ File validation passed");

        // CHECK 3: Test geocoding API
        console.log("7. Starting geocode fetch...");
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
        console.log("8. Geocode URL:", geocodeUrl);

        const geocodeResponse = await fetch(geocodeUrl, {
          headers: {
            'User-Agent': 'WanderLust/1.0 (your-email@example.com)'
          }
        });

        console.log("9. Geocode response status:", geocodeResponse.status);
        console.log("10. Geocode response headers:", Object.fromEntries(geocodeResponse.headers));

        if (!geocodeResponse.ok) {
          const errorText = await geocodeResponse.text();
          console.error("❌ FAIL: Geocode API error");
          console.error("Status:", geocodeResponse.status);
          console.error("Response:", errorText.substring(0, 500));
          throw new Error(`Geocoding failed: ${geocodeResponse.status}`);
        }

        const geocodeData = await geocodeResponse.json();
        console.log("11. Geocode data received:", geocodeData.length, "results");

        if (geocodeData.length === 0) {
          console.error("❌ FAIL: No geocode results for location:", location);
          req.flash("error", "Location not found");
          return res.redirect("/listings/new");
        }

        const lat = parseFloat(geocodeData[0].lat);
        const lon = parseFloat(geocodeData[0].lon);
        console.log("12. Coordinates parsed:", { lat, lon });

        // CHECK 4: Cloudinary file info
        let url = req.file.path;
        let filename = req.file.filename;
        console.log("13. Cloudinary info:", { url, filename });

        // CHECK 5: Create listing object
        console.log("14. Creating new listing object...");
        const newlisting = new Listing(req.body.listing);
        newlisting.owner = req.user._id;
        newlisting.image = { url, filename };
        newlisting.coordinates = { lat, lon };
        console.log("15. Listing object created:", {
          owner: newlisting.owner,
          title: newlisting.title,
          hasImage: !!newlisting.image,
          hasCoordinates: !!newlisting.coordinates
        });

        // CHECK 6: Save to MongoDB
        console.log("16. Attempting to save to MongoDB...");
        await newlisting.save();
        console.log("17. ✅ Listing saved successfully!");

        req.flash("success", "New Listing Created!");
        console.log("18. Redirecting to /listings");
        console.log("============ NEW LISTING REQUEST END (SUCCESS) ============");
        res.redirect("/listings");

      } catch (error) {
        console.error("============ ERROR CAUGHT ============");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        console.error("============ ERROR END ============");
        next(error);
      }
    };


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
    