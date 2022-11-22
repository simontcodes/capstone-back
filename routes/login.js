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

//importing knex to do queries on the DB mySQL
const knex = require("knex")(require("../knexfile"));

router.post("/", async (req, res) => {
  try {
    //using deconstruction to get username and password from the reques body
    const { email, password } = req.body;
    console.log("email:", email, "password:", password);
    // search DB for user that matches the email in the request
    const foundUser = await knex
      .select("*")
      .from("client")
      .where({ email: email });

    if (!foundUser[0].email) {
      res.status(404);
      return res.send("User doesnt exist");
    }

    //if the password of the found admin is the same as the password sent in the request respond with the token
    if (foundUser[0].password == password) {
      const token = jwt.sign({ name: foundUser[0].firstName }, JWT_SECRET_KEY);
      res.json({
        message: "Successfully logged in",
        token,
        email: email,
      });
    } else {
      res.status(403).json({ error: "Incorrect Password" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
