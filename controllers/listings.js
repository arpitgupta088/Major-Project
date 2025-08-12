const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// module.exports.index = async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index", { allListings });
// }

module.exports.index = async (req, res) => {
    const { category } = req.query;
    let allListings;

    if (category) {
        allListings = await Listing.find({ category });
    } else {
        allListings = await Listing.find({});
    }

    res.render("listings/index", { allListings, category});
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new"); // ye new listing ka form render karega
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner"); // ye listing ko id se dhoondta h aur reviews ko populate karta h
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listings");
    }

    res.render("listings/show", { listing }); // ye listing ko show karega
}

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
        .send()


    let url = req.file.path;
    let filename = req.file.filename;

    // let {title, description, image, price, location, country} = req.body; //iski jagah niche wali line likh skte h
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created"); // success is key and new listing created is message
    res.redirect("/listings"); // ye redirect karega listings ke index page par
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    const transformedImageUrl = originalImageUrl.replace(
        "/upload/",
        "/upload/w_250,c_fill/"
    );

    res.render("listings/edit", { listing, originalImageUrl: transformedImageUrl });

};

const { cloudinary } = require("../cloudConfig.js");

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    // Update basic fields
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    // If a new image is uploaded, delete old image and update
    if (typeof req.file !== "undefined") {
        // DELETE old image from Cloudinary
        if (listing.image && listing.image.filename) {
            await cloudinary.uploader.destroy(listing.image.filename);
        }

        // SAVE new image
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.filterByCategory = async (req, res) => {
    const { category } = req.params;
    const allListings = await Listing.find({ category: category });
    res.render("listings/index", { allListings, category });
};



module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id); // ye listing ko delete karega
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!"); // ye 
    res.redirect("/listings");
};

