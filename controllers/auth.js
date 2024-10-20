const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const auth = require('../config/auth');

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});

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

module.exports = router;