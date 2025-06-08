const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust"; // mongodb ka url h

main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

async function main(){        //database k liye func likha h
    await mongoose.connect(mongoUrl); // ye connect hoga
}

const initDB = async () => {
    await Listing.deleteMany({}) // ye sabhi listings ko delete karega agr kuch phle se hai to
    await Listing.insertMany(initData.data); // ye initData se sabhi listings ko insert karega
    console.log("Database was initialized ");
};

initDB();