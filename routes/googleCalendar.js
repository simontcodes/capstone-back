const { google } = require("googleapis");
require("dotenv").config();
const express = require("express");
const router = express.Router();

// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

// Google calendar API settings
const SCOPES = "https://www.googleapis.com/auth/calendar";
const calendar = google.calendar({ version: "v3" });

const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
);

const getEvents = async (dateTimeStart, dateTimeEnd) => {
  try {
    let response = await calendar.events.list({
      auth: auth,
      calendarId: calendarId,
      timeMin: dateTimeStart,
      timeMax: dateTimeEnd,
      timeZone: "America/Toronto",
    });

    let items = response["data"]["items"];
    return items;
  } catch (error) {
    console.log(`Error at getEvents --> ${error}`);
    return 0;
  }
};

router.route("/").post(async (req, res) => {
  const start = JSON.parse(req.body.startDate);

  const end = new Date(start);
  const endDate = new Date(end.setDate(end.getDate() + 1));

  getEvents(start, endDate)
    .then((response) => {
      console.log(response);
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500);
      console.log(err);
    });
});

module.exports = router;
