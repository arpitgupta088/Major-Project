const express = require("express");
const router = express.Router({mergeParams: true}); // mergeParams ko true karne se ye listing ke id ko bhi access kar sakta h
const wrapAsync = require("../utils/wrapAsync.js"); 
const ExpressError= require("../utils/ExpressError.js"); 
const {reviewSchema} = require("../schema.js"); 
const Review = require("../models/review.js"); 
const Listing = require("../models/listing.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){ // agar error aata h to ye error handle karega
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else{
        next(); // agar error nahi aata h to ye next middleware ko call karega
    }
  };

//Post route for reviews
router.post("/", validateReview, wrapAsync(async (req, res) => {
    
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview); // ye listing ke andar review ko push karega

    await newReview.save(); // ye review ko save karega
    await listing.save(); // ye listing ko save karega

    res.redirect(`/listings/${listing._id}`); 
}));
    
//Delete route for reviews
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // ye listing se review ko remove karega jo reviewId se match karega
    await Review.findById(reviewId);

    res.redirect(`/listings/${id}`); 
})
);

module.exports = router; 