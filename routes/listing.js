const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");   //.. mtlb ham parent directory me ja rhe h
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js"); 



//index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

//new route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new"); // ye new listing ka form render karega
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews", 
             populate: {
                path: "author",
             },
    })
    .populate("owner"); // ye listing ko id se dhoondta h aur reviews ko populate karta h
    if(!listing){
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listings");
    }

    res.render("listings/show", { listing }); // ye listing ko show karega
}));

//create route

router.post("/", validateListing, wrapAsync(async (req, res, next) => {

    // let {title, description, image, price, location, country} = req.body; //iski jagah niche wali line likh skte h
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created"); // success is key and new listing created is message
    res.redirect("/listings"); // ye redirect karega listings ke index page par
})
);

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
      if(!listing){
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listings");
    }

    res.render("listings/edit", { listing });
}));

//Update route
// router.put("/:id", validateListing, wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`); // ye redirect karega listing ke show page par
// }));
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    listing.image.url = req.body.listing.image.url;

    await listing.save();
    req.flash("success", "Listing Updated!"); 
    res.redirect(`/listings/${id}`);
}));


// delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id); // ye listing ko delete karega
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!"); // ye 
    res.redirect("/listings");
}));

module.exports = router; 