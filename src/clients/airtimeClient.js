const socketRequest = require("./socketRequest");
const airtimeTopUpAdapter = require("../adapters/airtimeTopUpAdapter");
const mnoAirtimeValidationAdapter = require("../adapters/mnoAirtimeValidationAdapter");
const mnoDataBundleValidationAdapter = require("../adapters/mnoDataBundleValidator");

const port = process.env.AEON_AIRTIME_PORT || 7800;
const host = process.env.AEON_AIRTIME_URL || "aeon.qa.bltelecoms.net";
const ttl = process.env.TTL || 60000;
const userPin = process.env.AEON_AIRTIME_PIN || "016351";
const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "865181";
const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "w!22!t";

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
  return await socketRequest(host, port, xml, ttl).then((serverResponse) => {
    console.log("AirTime Validation response: ", serverResponse);
    return mnoAirtimeValidationAdapter.toJS(serverResponse);
  });
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
  return await socketRequest(host, port, xml, ttl).then((serverResponse) => {
    console.log("AirTime Topup response: ", serverResponse);
    return airtimeTopUpAdapter.toJS(serverResponse);
  });
}

module.exports = {
  doAirtimeValidation,
  doAirtimeTopUp,
};
