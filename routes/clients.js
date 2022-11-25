const express = require("express");
const router = express.Router();
const utils = require("../Utils/Utils");
//importing uuid to make unique ids for every item
const uuid = require("uuid");
//importing knex to do queries on the DB mySQL
const knex = require("knex")(require("../knexfile"));

router.route("/").get(async (req, res) => {
  try {
    const clientData = await knex.select("*").from("client");

    res.status(200).json(clientData);
  } catch (error) {
    // res.status(500).json({ message: "Unable to retrieve clients data" });
  }
});

module.exports = router;

// router.route("/client/:clientId").get(async (req, res) => {
//   try {
//     //Queriyng the data base to get single client by id
//     const singleClient = await knex
//       .select("*")
//       .from("client")
//       .where({ id: req.params.clientId });
//     //getting the appointments associated with that client
//       const clientAppointments = await knex
//       .select("*")
//       .from("appointment")
//       .where({ client_id: req.params.clientId });
//     //getting the work exp associated with that client
//       const clientWorkExperiences = await knex
//       .select("*")
//       .from("workExp")
//       .where({ client_id: req.params.clientId });

//       const fullClient = [singleClient, clientAppointments, clientWorkExperiences]

//     res.status(200).json(fullClient);
//   } catch (error) {
//     res.status(404).json({ message: "client not found" });
//   }
// });

// module.exports = router;
