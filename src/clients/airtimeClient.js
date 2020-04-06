const socketRequest = require("./socketRequest");
const airtimeTopUpAdapter = require("../adapters/airtimeTopUpAdapter");
const mnoAirtimeValidationAdapter = require("../adapters/mnoAirtimeValidationAdapter");
const mnoDataBundleValidationAdapter = require("../adapters/mnoDataBundleValidator");

const port = process.env.PORT || 7800;
const host = process.env.EXTERNAL_URL || "aeon.qa.bltelecoms.net";
const ttl = process.env.TTL || 60000;
const userPin = process.env.PIN || "016351";
const deviceId = process.env.DEVICE_ID || "865181";
const deviceSer = process.env.DEVICE_SER || "w!22!t";

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
        return await socketRequest(host, port, xml, ttl).then(serverResponse => {
          console.log("AirTime Validation response: ", serverResponse);
          return mnoAirtimeValidationAdapter.toJS(serverResponse);
        });
      }

async function doDataBundleValidation(transType, reference, phoneNumber, product) {
        xml = mnoDataBundleValidationAdapter.toXML(
          userPin,
          deviceId,
          deviceSer,
          transType,
          reference,
          phoneNumber,
          product
        );
        return await socketRequest(host, port, xml, ttl).then(serverResponse => {
          console.log("DataBundle Validation response: ", serverResponse);
          return mnoDataBundleValidationAdapter.toJS(serverResponse);
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
  return await socketRequest(host, port, xml, ttl).then(serverResponse => {
    console.log("AirTime Topup response: ", serverResponse);
    return airtimeTopUpAdapter.toJS(serverResponse);
  });
}

module.exports = { doAirtimeValidation, doDataBundleValidation, doAirtimeTopUp };
