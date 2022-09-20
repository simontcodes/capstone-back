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
    .post(async (req, res) =>{
        console.log(req.body)
        try {
            const result = await knex("client").insert(req.body);
            const createdWarehouse = await knex("client").where({ id: result[0] });
        
            res.status(201).json(createdWarehouse);
          } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Unable to create client" });
          }
    }) 

   
    


module.exports = router;
