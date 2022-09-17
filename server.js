//importing DotEnv to be able to use variables storered in .env
require("dotenv").config();
// importing express
const express = require("express");
//importing axios to make api calls
const axios = require("axios");
//importing cors to be able to connect the back and front end in different domains
const cors = require("cors");
let PORT = process.env.PORT || 8080;

const app = express();
const clientsRoutes = require("./Routes/clients.js");
const loginRoutes = require("./Routes/login.js");

app.use(cors());
app.use(express.json());

//linking routes with routers
app.use("/login", loginRoutes);
app.use("/clients", clientsRoutes);
// app.use("/inventories", inventoriesRoutes);

app.listen(PORT, () => {
  console.log(`I'm here and I'm listening on port` + " " + PORT);
});
