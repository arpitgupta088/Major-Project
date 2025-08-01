if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
// console.log(process.env.SECRET)


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js"); // ye Listing model ko import kiya h
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js"); // ye listing route ko import kiya h
const reviewRouter = require("./routes/review.js"); // ye review route ko import kiya h
const userRouter = require("./routes/user.js");

// const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust"; // mongodb ka url h
const dbUrl = process.env.MONGO_URL;

main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

async function main() {        //database k liye func likha h
    await mongoose.connect(dbUrl); // ye connect hoga
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // ye body parser ka kaam karega, jo form se data ko parse karega
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); // ye public folder ko static folder banayega, jahan se css aur js files serve hongi


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error", ()=> {
    console.log("Session store error", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

// app.get("/", (req, res) => {  // this is the root route // basic api
//     res.send("HI i am root");
// });


app.use(session(sessionOptions)); // ye session middleware ko use karega
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); // ye passport ko initialize karega aur session ko use karega
passport.use(new LocalStrategy(User.authenticate())); // ye passport ko use karega local strategy ke liye

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success"); // ye flash messages ko set karega
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next(); // ye next middleware ko call karega
});

// app.get("/demouser",async (req, res) => { 
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "sigma-boy",
//     });
//     let registeredUser = await User.register(fakeUser, "password123");
//     res.send(registeredUser); 
// })

//listings
app.use("/listings", listingRouter); // ye listings route ko use karega listing.js me jaake

//Reviews
app.use("/listings/:id/reviews", reviewRouter);

app.use("/", userRouter);


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
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
});


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

