const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js"); // ye Listing model ko import kiya h
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js"); 
const ExpressError= require("./utils/ExpressError.js"); 

const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust"; // mongodb ka url h

main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

async function main() {        //database k liye func likha h
    await mongoose.connect(mongoUrl); // ye connect hoga
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // ye body parser ka kaam karega, jo form se data ko parse karega
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); // ye public folder ko static folder banayega, jahan se css aur js files serve hongi

app.get("/", (req, res) => {  // this is the root route // basic api
    res.send("HI i am root");
});

//index route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new"); // ye new listing ka form render karega
});

//show route
app.get("/listings/:id",wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing }); // ye listing ko show karega
}));

//create route

app.post("/listings", wrapAsync (async (req, res, next) => {
        if(!req.body.listing) { 
            throw new ExpressError(400, "Invalid Listing Data");
        } 
         // let {title, description, image, price, location, country} = req.body; //iski jagah niche wali line likh skte h
        const newlisting = new Listing(req.body.listing);
        if(!newlisting.title){
                throw new ExpressError(400, "Title is missing!");
        }
        if(!newlisting.description){
             throw new ExpressError(400, "Description is missing!");
        }
        if(!newlisting.location){
                throw new ExpressError(400, "Location is missing!");
        }
        await newlisting.save();
        res.redirect("/listings"); // ye redirect karega listings ke index page par
    })
);

// edit route
app.get("/listings/:id/edit",wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

//Update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`); // ye redirect karega listing ke show page par
}));

// delete route
app.delete("/listings/:id", wrapAsync (async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id); // ye listing ko delete karega
    console.log(deletedListing);
    res.redirect("/listings");
}));


// app.get("/testListing", async (req, res) => { 
//     let sampleListing = new Listing({
//         title: "My new House",
//         description: "This is a new house",
//         price: 1200,
//         location: "New York, paris",
//         country: "USA",
//     }); // ye ek naya listing banaya

//     await sampleListing.save(); // ye save hoga database mein
//     console.log("Listing saved to database");
//     res.send("successful testing");
// });

// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found")); // ye error handle karega agar koi route nahi mila
// });

app.use((err, req, res, next) => {
    let{statusCode=500, message="Something went wrong"} = err;
    res.render("error.ejs", {err});
})


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});