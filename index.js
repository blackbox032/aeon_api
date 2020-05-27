const dataClient = require("./src/clients/dataClient");
const airtimeClient = require("./src/clients/airtimeClient");
const electricityClient = require("./src/clients/electricityClient");

module.exports = {
  ...dataClient,
  ...airtimeClient,
  ...electricityClient
};
