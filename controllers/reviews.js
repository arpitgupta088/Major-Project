const Listing=  require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; 
    listing.reviews.push(newReview); // ye listing ke andar review ko push karega

    await newReview.save(); // ye review ko save karega
    await listing.save(); // ye listing ko save karega
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`); 
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // ye listing se review ko remove karega jo reviewId se match karega
    await Review.findById(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`); 
};