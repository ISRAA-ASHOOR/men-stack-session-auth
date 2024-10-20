const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
require('dotenv').config();
require('./config/database');
const authController = require("./controllers/auth.js");
const session = require('express-session');

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
    })
);
app.use("/auth", authController);

app.get("/", (req, res) => {
    res.render("index.ejs", {
      user: req.session.user,
    });
});

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});