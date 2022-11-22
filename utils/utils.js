const fs = require("fs");

const readAdmins = () => {
  const allAdmins = fs.readFileSync("./Data/Admins.json");
  const parsedAdmins = JSON.parse(allAdmins);
  return parsedAdmins;
};

function authGetClients(req, res, next) {
  const email = req.headers.email;
  console.log("at line 66", email);
  const foundUser = knex.select("*").from("client").where({ email: email });

  console.log(foundUser[0]);

  //checks if the user is admin which is a boolean value
  if (foundUser[0].isAdmin === 0) {
    res.status(401);
    return res.send("Not Allowed");
  }

  next();
}

module.exports = { readAdmins, authGetClients };
