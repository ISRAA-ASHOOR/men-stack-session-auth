const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
require('dotenv').config();
require('./config/database');
const authController = require("./controllers/auth.js");
const session = require('express-session');
const MongoStore = require("connect-mongo");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

const app = express();

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '3000';

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride('_method'));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
      }),
    })
);
// Add our custom middleware right after the session middleware
app.use(passUserToView);

app.use("/auth", authController);

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/vip-lounge", isSignedIn, (req, res) => {
    if (req.session.user) {
        res.send(`Welcome to the party ${req.session.user.username}.`);
    } else {
        res.sendStatus(404);
        // res.send("Sorry, no guests allowed.");
    }
});

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});