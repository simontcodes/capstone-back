const express = require("express");
const router = express.Router();
//importing JWT to be able to send encryp and decrypt tokens
const jwt = require("jsonwebtoken");
//import fs to be able to write and read json files
const fs = require("fs");
//using utils to keep code DRY
const utils = require("../Utils/Utils");
//importing uuid to make unique ids for every item
const uuid = require("uuid");
//using .env file to store private jwt key
let JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

router.post("/", (req, res) => {
  //using deconstruction to get username and password from the reques body
  const { email, password } = req.body;
  // Read the admins
  const admins = utils.readAdmins();
  const foundAdmin = admins.find((admin) => admin.email === email);

  //if the password of the found admin is the same as the password sent in the request respond with the token
  if (foundAdmin.password === password) {
    const token = jwt.sign({ name: foundAdmin.name }, JWT_SECRET_KEY);
    res.json({
      message: "Successfully logged in",
      token,
      email: email,
    });
  } else {
    res.status(403).json({ error: "Admin not Found" });
  }
});

module.exports = router;
