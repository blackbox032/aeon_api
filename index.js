const dataClient = require("./src/clients/dataClient");
const airtimeClient = require("./src/clients/airtimeClient");
const electricityClient = require("./src/clients/electricityClient");
const dstvClient = require("./src/clients/dstvClient");
const allClient = require("./src/clients/allClient");

module.exports = {
  ...dataClient,
  ...airtimeClient,
  ...electricityClient,
  ...dstvClient,
  ...allClient
};