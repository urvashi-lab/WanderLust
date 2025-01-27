const express = require('express');
const router = express.Router();

const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")

const listingController=require("../controllers/listing.js")
const wrapAsync=require("../utils/wrapAsync.js")
const {storage} = require("../cloudConfig.js")
const multer  = require('multer')
const upload = multer({ storage})

router.route("/")
.get(wrapAsync(listingController.index))//Showing all listings
.post(isLoggedIn,upload.single("listing[image][url]"),validateListing,wrapAsync(listingController.newListing)); //Create listing


//rendering new ejs page
router.get("/new", isLoggedIn,listingController.renderNewForm);

router.get("/category",listingController.category);

router.route("/:id")
//Show individual listing
.get(wrapAsync(listingController.showlisting))
.put(isOwner,upload.single("listing[image][url]"),validateListing,wrapAsync(listingController.editListing)) //Edit the listing
.delete(isOwner,wrapAsync(listingController.deleteListing));//Delete listing

 //rendering edit.ejs
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditPage));

 //rendering search listings
 router.get("/search/location",wrapAsync(listingController.search));
module.exports = router;