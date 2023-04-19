const express = require("express");
const passport = require("passport");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.post("/signup", async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
    });
    const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post(
  "/login",
  passport.authenticate("openidconnect"),
  async (req, res) => {
    try {
      const user = await User.findOne({ email: req.user.email });
      const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET);
      res.json({ token });
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

router.get("/user", function (req, res) {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
