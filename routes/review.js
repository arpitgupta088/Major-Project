const express = require("express");
const router = express.Router({mergeParams: true}); // mergeParams ko true karne se ye listing ke id ko bhi access kar sakta h
const wrapAsync = require("../utils/wrapAsync.js"); 
const ExpressError= require("../utils/ExpressError.js"); 
const Review = require("../models/review.js"); 
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController =  require("../controllers/reviews.js")
const review = require("../models/review.js");

//Post route for reviews
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
    
//Delete route for reviews
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview)
);

module.exports = router; 