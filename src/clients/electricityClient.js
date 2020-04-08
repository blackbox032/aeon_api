const debug = require("../utils/debug");
const socketClient = require("./socketClient");
const meterTopUpAdapter = require("../adapters/meterVoucherAdapter");
const meterConfirmAdapter = require("../adapters/meterConfirmAdapter");
const saleConfirmAdapter = require("../adapters/saleConfirmAdapter");

const port = process.env.AEON_ELECTRICITY_PORT || 7893;
const host = process.env.AEON_ELECTRICITY_URL || "196.26.170.3";
const ttl = process.env.TTL || 60000;
const userPin = process.env.AEON_ELECTRICITY_PIN || "011234";
const deviceId = process.env.AEON_ELECTRICITY_DEVICE_ID || "7305";
const deviceSer = process.env.AEON_ELECTRICITY_DEVICE_SER || "TiZZIw779!";

async function doVerifyMeter(meterNumber, amount) {
  xml = meterConfirmAdapter.toXML(
    userPin,
    deviceId,
    deviceSer,
    meterNumber,
    amount
  );
  const client = socketClient(host, port, ttl);
  return await client
    .request(xml)
    .then((serverResponse) => {
      debug("Meter verify response: ", serverResponse);
      client.end();
      return meterConfirmAdapter.toJS(serverResponse);
    })
    .catch((aeonErrorObject) => {
      client.end();
      return aeonErrorObject;
    });
}

async function doMeterTopUp(meterNumber, amount) {
  xml = meterConfirmAdapter.toXML(
    userPin,
    deviceId,
    deviceSer,
    meterNumber,
    amount
  );
  const client = socketClient(host, port, ttl);
  return await client
    .request(xml)
    .then(async (verifyResponse) => {
      debug("Meter verify response: ", verifyResponse);
      response = meterConfirmAdapter.toJS(verifyResponse);
      xml = meterTopUpAdapter.toXML(response.SessionId, response.TransRef);
      return await client
        .request(xml)
        .then((serverResponse) => {
          debug("Meter topup response: ", serverResponse);
          client.end();
          return meterTopUpAdapter.toJS(serverResponse);
        })
        .catch((aeonErrorObject) => {
          client.end();
          return aeonErrorObject;
        });
    })
    .catch((aeonErrorObject) => {
      debug("Error: " + aeonErrorObject);
      client.end();
      return aeonErrorObject;
    });
}

async function getSaleConfirmation(confrimationRef, reference) {
  xml = saleConfirmAdapter.toXML(
    userPin,
    deviceId,
    deviceSer,
    confrimationRef,
    reference
  );
  const client = socketClient(host, port, ttl);
  return await client
    .request(xml)
    .then((serverResponse) => {
      debug("Meter verify response: ", serverResponse);
      client.end();
      return saleConfirmAdapter.toJS(serverResponse);
    })
    .catch((aeonErrorObject) => {
      client.end();
      return aeonErrorObject;
    });
}

module.exports = { doVerifyMeter, doMeterTopUp, getSaleConfirmation };
