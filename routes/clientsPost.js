const express = require("express");
const router = express.Router();
// const fs = require("fs");
const utils = require("../Utils/Utils");
//importing uuid to make unique ids for every item
const uuid = require("uuid");
//importing knex to do queries on the DB mySQL
const knex = require("knex")(require("../knexfile"));
//unique ids
const { v4: uuidv4 } = require("uuid");

//sendgrid api key saved in .env file
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
//importing sendgrid library
const sgMail = require('@sendgrid/mail');
// set api key on the api call
sgMail.setApiKey(SENDGRID_API_KEY);

router.route("/").post(async (req, res) => {
  const clientWorkExp = JSON.parse(req.body.jobs);
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
    cityOfPreference: req.body.cityOfPreference,
  };

  const clientAppointment = {
    dateOfAppointment: req.body.dateOfAppointment,
    timeOfAppointment: req.body.timeOfAppointment,
    client_id: clientInfo.id,
    typeOfService: req.body.typeOfService,
  };

  try {
    const resultCLient = await knex("client").insert(clientInfo);
    const createdClient = await knex("client").where({ id: resultCLient[0] });
    const resultAppointment = await knex("appointment").insert(
      clientAppointment
    );

    for (let i = 0; i < clientWorkExp.length; i++) {
      clientWorkExp[i].client_id = clientInfo.id;
    }
    for (let i = 0; i < clientWorkExp.length; i++) {
      await knex("workExp").insert(clientWorkExp[i]);
    }
    // ------------------------------------------------------
    console.log(clientInfo.email)
    // email message format
    const message = {
      to: `${clientInfo.email}`,
      from: {
        name: "CM Immigration.Inc",
        email: "simont.codes@gmail.com",
      },
          subject: "Appointment Details",
          text: "how cool is this",
          html: `<h1> Hi ${clientInfo.firstName} ${clientInfo.lastName}</h1>
                  <p>We will see you on ${clientAppointment.dateOfAppointment} at ${clientAppointment.timeOfAppointment} </p>
                  Holi estoy probando`,
        };
        
        // the actual api call  that returns a promise
        sgMail
        .send(message)
        .then((response) => {
          console.log("email sent");
        })
        .catch((error) => {
          console.log(error);
        });
        
        // ------------------------------------------------------
    res.status(201).json(createdClient);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to create client" });
  }
});

module.exports = router;
