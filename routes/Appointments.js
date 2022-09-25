const express = require("express");
const router = express.Router();

//importing knex to do queries on the DB mySQL
const knex = require("knex")(require("../knexfile"));



router
.route("/").get(async (req, res) => {
  
    try {
        const clientData = await knex.select("*").from("client");
        const appointmentsData = await knex.select("*").from("appointment");
        
        for (let appointment of appointmentsData) {
            let foundClient = clientData.find(client => client.id === appointment.client_id)
            appointment.fullName = `${foundClient.firstName} ${foundClient.lastName}`;
        }
        
    
       


    
        res.status(200).json(appointmentsData);
      } catch (error) {
        res.status(500).json({ message: "Unable to retrieve appointments data" });
      }
 
});

module.exports = router;
