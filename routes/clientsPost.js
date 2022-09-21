const express = require("express");
const router = express.Router();
// const fs = require("fs");
const utils = require("../Utils/Utils");
//importing uuid to make unique ids for every item
const uuid = require("uuid");
//importing knex to do queries on the DB mySQL
const knex = require('knex')(require("../knexfile"));
//unique ids
const { v4: uuidv4 } = require('uuid');


router
    .route("/")
    .post(async (req, res) =>{
      console.log(typeof(req.body.jobs))
      // const jobs = [...req.body.jobs]
      // jobs.forEach((job, i) => {
        //   job.client_id = 1000 + i
        // })
        // console.log(jobs)
        const clientWorkExp = JSON.parse(req.body.jobs); 
        console.log("when it gets to the api",clientWorkExp);
        const clientInfo = {
          id: uuidv4(),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          educationLevel: req.body.educationLevel,
          canadaVisitor: req.body.canadaVisitor,
          canadaStudent: req.body.canadaStudent,
          canadaWorker: req.body.canadaWorker,
          canadaYearsOfExpirience: req.body.canadaYearsOfExpirience,
          studyInCanada: req.body.studyInCanada,
          englishTest: req.body.englishTest,
          englishListening: req.body.englishListening,
          englishReading: req.body.englishReading,
          englishSpeaking: req.body.englishSpeaking,
          englishWriting: req.body.englishWriting,
          provinceOfPreference: req.body.provinceOfPreference,
          cityOfPreference: req.body.cityOfPreference
        }
        
        
        try {
          const result = await knex("client").insert(clientInfo);
          const createdClient = await knex("client").where({ id: result[0] });
          
          
          for(let i = 0; i < clientWorkExp.length; i++){           
            clientWorkExp[i].client_id = clientInfo.id;
          }
          console.log(clientWorkExp);
            for(let i = 0; i < clientWorkExp.length; i++){
              await knex("workExp").insert(clientWorkExp[i]);
            }

        
            res.status(201).json(createdClient);
          } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Unable to create client" });
          }
    }) 

   
    


module.exports = router;
