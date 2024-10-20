const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const auth = require('../config/auth');
const session = require('express-session');

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});

router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

// sing  up
router.post("/sign-up", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const userInDatabase = await User.findOne({ username: username });
    if (userInDatabase) {
        return res.send("Username already taken.");
    }
    if (password !== confirmPassword) {
        return res.send("Password and Confirm Password must match");
    }

    const hashedPassword = auth.encryptPassword(password);

    const payload = {username, password: hashedPassword};
    const newUser = await User.create(payload);

    res.send(`Thanks for signing up ${newUser.username}`);
});

// sign in
router.post("/sign-in", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const userInDatabase = await User.findOne({ username: username });
    if (!userInDatabase) {
        return res.send("Login failed. Please try again.");
    }
    // not working !!!
    const validPassword = auth.comparePassword(password, userInDatabase.password);
    if (!validPassword) {
        return res.send("Login failed. Please try again.");
    }

    req.session.user = {
        username: userInDatabase.username,
    };

    res.redirect("/");
});


module.exports = router;