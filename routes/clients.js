const express = require("express");
const router = express.Router();
// const fs = require("fs");
const utils = require("../Utils/Utils");
//importing uuid to make unique ids for every item
const uuid = require("uuid");
//importing knex to do queries on the DB mySQL
const knex = require('knex')(require("../knexfile"));


router
    .route("/")
    .get(async (req, res) => {

        try {
            const clientData = await knex.select("*").from("client");

            res.status(200).json(clientData);
        } catch (error){
            res.status(500).json({ message: "Unable to retrieve clients data" });
        }
    })

module.exports = router;
