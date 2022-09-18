const express = require("express");
const router = express.Router();
// const fs = require("fs");
const utils = require("../Utils/Utils");
//importing uuid to make unique ids for every item
const uuid = require("uuid");

router.get("/", (req, res) => {
    // Read the file

    res.status(200).json({message: `${req.name} you are authorized to see this`})
  });

module.exports = router;
