const dataClient = require("./src/clients/dataClient");
const airtimeClient = require("./src/clients/airtimeClient");
const electricityClient = require("./src/clients/electricityClient");
const paymentsClient = require("./src/clients/paymentsClient");
const customerProfile = require("./src/loyalty/customerProfile");

module.exports = {
  ...dataClient,
  ...airtimeClient,
  ...electricityClient,
  ...paymentsClient,
  ...customerProfile
};