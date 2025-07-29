const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");   //.. mtlb ham parent directory me ja rhe h
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js"); 

const listingController = require("../controllers/listings.js");

//index route
router.get("/", wrapAsync(listingController.index));    // jo kaam ho rha h wo controllers folder me dal diya h
                                    //index var me aur use yaha require krliya

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show route
router.get("/:id", wrapAsync(listingController.showListing));

//create route

router.post("/", validateListing, 
    wrapAsync(listingController.createListing)
);

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, 
    wrapAsync(listingController.renderEditForm));

//Update route
// router.put("/:id", validateListing, wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`); // ye redirect karega listing ke show page par
// }));
router.put("/:id", isLoggedIn, isOwner, validateListing, 
    wrapAsync(listingController.updateListing));


// delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router; 