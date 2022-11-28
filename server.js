//importing DotEnv to be able to use variables storered in .env
require("dotenv").config();
//importing JWT to be able to send encryp and decrypt tokens
const jwt = require("jsonwebtoken");
const utils = require("./utils/utils.js");
// importing express
const express = require("express");
//importing axios to make api calls
const axios = require("axios");
//importing cors to be able to connect the back and front end in different domains
const cors = require("cors");
//using .env file to store private jwt key
let JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
let PORT = process.env.PORT || 8080;
//using knex library to access sql
const knex = require("knex")(require("./knexfile"));

const app = express();
const clientsRoutes = require("./Routes/clients.js");
const loginRoutes = require("./Routes/login.js");
const clientsPostRoutes = require("./Routes/clientsPost.js");
const paymentRoutes = require("./Routes/payment.js");
const appointmentsRoutes = require("./Routes/appointments.js");
const clientRoutes = require("./routes/client.js");
const questionnaireRoutes = require("./routes/questionnaire.js");
const { client } = require("./knexfile.js");

app.use(cors());
app.use(express.json());

function authorize(req, res, next) {
  //storing the request header that contains the token
  const bearerTokenString = req.headers.authorization;

  //if the token is not in the request send back an error
  if (!bearerTokenString) {
    return res.status(401).json({
      error: "Resource requires Bearer token in Authorization header",
    });
  }

  //spliting the header into 2, the bearer and the token
  const splitBearerTokenString = bearerTokenString.split(" ");

  //if the array that contains the 2 pieces of the request header is not equal to 2 send back an error
  if (splitBearerTokenString.length !== 2) {
    return res.status(400).json({ error: "Bearer token is malformed" });
  }

  //storing the token in a variable
  const token = splitBearerTokenString[1];

  //veryfing the token with jwt
  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid JWT" });
    } else {
      req.name = decoded.name;
      next();
    }
  });
}

// ------------------------------------------
function authGetClients(req, res, next) {
  async function findUser(userInfo) {
    const email = req.headers.email;

    const foundUser = await knex
      .select("*")
      .from("client")
      .where({ email: email });

    return foundUser[0];
  }
  let foundUser = {};
  findUser(req).then((response) => {
    foundUser = response;
    //checks if the user is admin which is a boolean value
    if (foundUser.isAdmin == 0) {
      // res.status(401);
      // return res.send("Not Allowed");
      res.status(401);
      return;
    } else {
      next();
    }
  });
}

function authGetClient(req, res, next) {
  async function findUser(userInfo) {
    const email = req.headers.email;

    const foundUser = await knex
      .select("*")
      .from("client")
      .where({ email: email });

    return foundUser[0];
  }

  let foundUser = {};
  findUser(req).then((response) => {
    foundUser = response;

    //only lets an admin or the owner of the profile get access to /client:id
    if (foundUser.isAdmin === 0 && foundUser.id !== req.params.clientId) {
      return res.status(401).send("Not Allowed");
    }
  });

  next();
}

// --------------------------------------------------
//linking routes with routers
app.use("/login", loginRoutes);
app.use("/clients", authorize, authGetClients, clientsRoutes);
app.use("/client", authorize, authGetClient, clientRoutes);
// ---------new added route -----------!!!--
app.use("/appointments", authorize, authGetClients, appointmentsRoutes);
app.use("/clientsPost", clientsPostRoutes);
app.use("/questionnaire", questionnaireRoutes);
app.use("/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log(`I'm here and I'm listening on port` + " " + PORT);
});
