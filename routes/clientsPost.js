const express = require("express");
const router = express.Router();
// const fs = require("fs");
// const utils = require("../Utils/Utils");
// //importing uuid to make unique ids for every item
// const uuid = require("uuid");
//importing knex to do queries on the DB mySQL
const knex = require("knex")(require("../knexfile"));
//unique ids
const { v4: uuidv4 } = require("uuid");
//google calendar api
const { google } = require("googleapis");
//env variables to use google api
require("dotenv").config();

//sendgrid api key saved in .env file
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
//importing sendgrid library
const sgMail = require("@sendgrid/mail");
// set api key on the api call
sgMail.setApiKey(SENDGRID_API_KEY);

//variables used to create appointment in google calendar
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;
const SCOPES = "https://www.googleapis.com/auth/calendar";
const calendar = google.calendar({ version: "v3" });
const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
);
const TIMEOFFSET = "-00:00";

//function that takes the time from front end
const dateTimeForCalendar = (date) => {
  // let parsedDate = Date(Date.parse(date));

  // console.log("inside dateTimeForCalendar", date);
  // let year = parsedDate.getFullYear();
  // let month = parsedDate.getMonth() + 1;
  // if (month < 10) {
  //   month = `0${month}`;
  // }
  // let day = parsedDate.getDate();
  // if (day < 10) {
  //   day = `0${day}`;
  // }
  // let hour = parsedDate.getHours();
  // if (hour < 10) {
  //   hour = `0${hour}`;
  // }
  // let minute = parsedDate.getMinutes();
  // if (minute < 10) {
  //   minute = `0${minute}`;
  // }

  // let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

  let event = new Date(Date.parse(date));

  let startDate = event;
  // Delay in end time is 1
  let endDate = new Date(
    new Date(startDate).setHours(startDate.getHours() + 1)
  );

  return {
    start: startDate,
    end: endDate,
  };
};

// Insert new event to Google Calendar
const insertEvent = async (event) => {
  try {
    let response = await calendar.events.insert({
      auth: auth,
      calendarId: calendarId,
      resource: event,
    });

    if (response["status"] == 200 && response["statusText"] === "OK") {
      console.log(response);
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(`Error at insertEvent --> ${error}`);
    return 0;
  }
};

// router.route("/").post(async (req, res) => {
//   const clientWorkExp = JSON.parse(req.body.jobs);
//   const clientInfo = {
//     id: uuidv4(),
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     email: req.body.email,
//     phoneNumber: req.body.phoneNumber,
//     educationLevel: req.body.educationLevel,
//     canadaVisitor: req.body.canadaVisitor,
//     canadaStudent: req.body.canadaStudent,
//     canadaWorker: req.body.canadaWorker,
//     canadaYearsOfExpirience: req.body.canadaYearsOfExpirience,
//     studyInCanada: req.body.studyInCanada,
//     englishTest: req.body.englishTest,
//     englishListening: req.body.englishListening,
//     englishReading: req.body.englishReading,
//     englishSpeaking: req.body.englishSpeaking,
//     englishWriting: req.body.englishWriting,
//     provinceOfPreference: req.body.provinceOfPreference,
//     cityOfPreference: req.body.cityOfPreference,
//   };

//   const clientAppointment = {
//     dateOfAppointment: req.body.dateOfAppointment,
//     timeOfAppointment: req.body.timeOfAppointment,
//     client_id: clientInfo.id,
//     typeOfService: req.body.typeOfService,
//   };

//   try {
//     const resultCLient = await knex("client").insert(clientInfo);
//     const createdClient = await knex("client").where({ id: resultCLient[0] });
//     const resultAppointment = await knex("appointment").insert(
//       clientAppointment
//     );

//     for (let i = 0; i < clientWorkExp.length; i++) {
//       clientWorkExp[i].client_id = clientInfo.id;
//     }
//     for (let i = 0; i < clientWorkExp.length; i++) {
//       await knex("workExp").insert(clientWorkExp[i]);
//     }
//     // ------------------------------------------------------
//     console.log(clientInfo.email);
//     // email message format
//     const message = {
//       to: `${clientInfo.email}`,
//       from: {
//         name: "CM Immigration.Inc",
//         email: "simont.codes@gmail.com",
//       },
//       subject: "Appointment Details",
//       text: "how cool is this",
//       html: `<h1> Hi ${clientInfo.firstName} ${clientInfo.lastName}</h1>
//                   <p>We will see you on ${clientAppointment.dateOfAppointment} at ${clientAppointment.timeOfAppointment} </p>
//                   Holi estoy probando`,
//     };

//     // the actual api call  that returns a promise
//     sgMail
//       .send(message)
//       .then((response) => {
//         console.log("email sent");
//       })
//       .catch((error) => {
//         console.log(error);
//       });

//     // ------------------------------------------------------
//     res.status(201).json(createdClient);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Unable to create client" });
//   }
// });

// ---------------------------New client flow--------------------------------
router.route("/").post(async (req, res) => {
  // const clientWorkExp = JSON.parse(req.body.jobs);
  const clientInfo = {
    id: uuidv4(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    //creates a random password that the user gets in the email
    password: uuidv4(),
    //all users created are NOT admins, admins are added manually to the DB
    isAdmin: false,
    //this is to check if the user has filled the form
    hasQuestions: false,
    //this is to check if user has changed the temporary password
    hasChangedPassword: false,
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
    await knex("appointment").insert(clientAppointment);

    //creating the appointment in google calendar
    let dateTime = dateTimeForCalendar(req.body.dateAndTime);
    console.log(dateTime);

    let event = {
      summary: `consultation for ${req.body.firstName} ${req.body.lastName}`,
      description: `1 Hour Consultation`,
      location: "online",
      start: {
        dateTime: dateTime["start"],
        timeZone: "America/Toronto",
      },
      end: {
        dateTime: dateTime["end"],
        timeZone: "America/Toronto",
      },
      attendees: [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    // attendees: [{ email: `${req.body.email}` }],
    // reminders: {
    //   useDefault: false,
    //   overrides: [
    //     { method: "email", minutes: 24 * 60 },
    //     { method: "popup", minutes: 10 },
    //   ],

    insertEvent(event)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

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
                  <p>this is your user: ${clientInfo.email}  </p>
                  <p>this is your temporary password: ${clientInfo.password}</p>
                  <p>Please log in and fill out the questionnaire before the appointment </p>
                  `,
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
