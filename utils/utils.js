const fs = require("fs");


const readAdmins = () => {
    const allAdmins = fs.readFileSync("./Data/Admins.json");
    const parsedAdmins = JSON.parse(allAdmins);
    return parsedAdmins;
  };


  module.exports = { readAdmins };