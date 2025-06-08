const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
});             // ye listing schema ho gya aur isey use krke ham ek model banayenge

const Listing = mongoose.model("Listing", listingSchema); // ye model ban gya
module.exports = Listing; // ab isey export krna hoga taki dusre file mein use kr sakein

