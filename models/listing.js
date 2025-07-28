const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: String,
        url: String,
        // type: String,
        // default: "https://images.unsplash.com/photo-1745681619881-975e836e432c?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // agar image ka link empty hoga to ye default link set ho jayega
        // set: (v) => v === "" ? "https://images.unsplash.com/photo-1745681619881-975e836e432c?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v, // agar image ka link empty hoga to jo link dala h wo set ho jayega
   },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review" // ye reference hai Review model ka, jisse ham listing ke andar reviews ko store kar sakte hain
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});             // ye listing schema ho gya aur isey use krke ham ek model banayenge

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } }); // ye listing ke saare reviews ko delete karega jo listing ke andar hain
    }
});

const Listing = mongoose.model("Listing", listingSchema); // ye model ban gya
module.exports = Listing; // ab isey export krna hoga taki dusre file mein use kr sakein

