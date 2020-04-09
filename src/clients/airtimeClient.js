const debug = require("../utils/debug");
const socketClient = require("./sockets/socketClient");
const airtimeTopUpAdapter = require("../adapters/airtimeTopUpAdapter");
const mnoAirtimeValidationAdapter = require("../adapters/mnoAirtimeValidationAdapter");

const port = process.env.AEON_AIRTIME_PORT || 7800;
const host = process.env.AEON_AIRTIME_URL || "aeon.qa.bltelecoms.net";
// const port = process.env.AEON_AIRTIME_PORT || 443;
// const host = process.env.AEON_AIRTIME_URL || "aeonssl.live.bltelecoms.net";
const ttl = process.env.TTL || 60000;
const userPin = process.env.AEON_AIRTIME_PIN || "016351";
const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "865181";
const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "w!22!t";
// const userPin = process.env.AEON_AIRTIME_PIN || "011234";
// const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "103936";
// const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "GniRR3t5639!";

async function doAirtimeValidation(transType, reference, phoneNumber, amount) {
  xml = mnoAirtimeValidationAdapter.toXML(
    userPin,
    deviceId,
    deviceSer,
    transType,
    reference,
    phoneNumber,
    amount
  );
  try {
    const client = await socketClient(host, port, ttl);
    return await client
      .request(xml)
      .then((serverResponse) => {
        debug("AirTime Validation response: ", serverResponse);
        client.end();
        return mnoAirtimeValidationAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        debug("AirTime Validation error: ", serverResponse);
        client.end();
        return aeonErrorObject;
      });
  } catch (error) {
    debug("AirTime Validation error: ", error);
    return error;
  }
}

async function doAirtimeTopUp(transType, reference, phoneNumber, amount) {
  xml = airtimeTopUpAdapter.toXML(
    userPin,
    deviceId,
    deviceSer,
    transType,
    reference,
    phoneNumber,
    amount
  );
  try {
    const client = await socketClient(host, port, ttl);
    return await client
      .request(xml)
      .then((serverResponse) => {
        debug("AirTime Topup response: ", serverResponse);
        client.end();
        return airtimeTopUpAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        client.end();
        return aeonErrorObject;
      });
  } catch (error) {
    return error;
  }
}

module.exports = {
  doAirtimeValidation,
  doAirtimeTopUp,
};
