const socketRequest = require("./socketRequest");
const meterTopUpAdapter = require("../adapters/meterVoucherAdapter");
const meterConfirmAdapter = require("../adapters/meterConfirmAdapter");

const port = process.env.PORT || 7893;
const host = process.env.EXTERNAL_URL || "196.26.170.3";
const ttl = process.env.TTL || 60000;
const userPin = process.env.PIN || "011234";
const deviceId = process.env.DEVICE_ID || "7305";
const deviceSer = process.env.DEVICE_SER || "TiZZIw779!";

async function doElectricityTopUp(sessionId, confrimRef, reference) {
  xml = meterTopUpAdapter.toXML(
    sessionId,
    confrimRef,
    reference
  );
  return await socketRequest(host, port, xml, ttl).then(serverResponse => {
    console.log("Electricity Topup response: ", serverResponse);
    return meterTopUpAdapter.toJS(serverResponse);
  });
}

async function doVerifyMeter(meterNumber, amount) {
        xml = meterConfirmAdapter.toXML(
          userPin,
          deviceId,
          deviceSer,
          meterNumber,
          amount
        );
        return await socketRequest(host, port, xml, ttl).then(serverResponse => {
          console.log("Meter verify response: ", serverResponse);
          return meterConfirmAdapter.toJS(serverResponse);
        });
      }

module.exports = { doElectricityTopUp, doVerifyMeter };