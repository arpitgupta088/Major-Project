const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");   //.. mtlb ham parent directory me ja rhe h
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) { // agar error aata h to ye error handle karega
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next(); // agar error nahi aata h to ye next middleware ko call karega
    }
};


//index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

//new route
router.get("/new", (req, res) => {
    res.render("listings/new"); // ye new listing ka form render karega
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews"); // ye listing ko id se dhoondta h aur reviews ko populate karta h
    res.render("listings/show", { listing }); // ye listing ko show karega
}));

//create route

router.post("/", validateListing, wrapAsync(async (req, res, next) => {

    // let {title, description, image, price, location, country} = req.body; //iski jagah niche wali line likh skte h
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings"); // ye redirect karega listings ke index page par
})
);

// edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

//Update route
// router.put("/:id", validateListing, wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`); // ye redirect karega listing ke show page par
// }));
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    listing.image.url = req.body.listing.image.url;

    await listing.save();
    res.redirect(`/listings/${id}`);
}));


// delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id); // ye listing ko delete karega
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router; 