const logger = require("aeon_api/src/utils/logger");
const socketClient = require("aeon_api/src/clients/sockets/socketClient");
const ACAdapter = require("../adapters/allClientAdapter");
const dstvAdapter = require("../adapters/dstvAdapter");

const port = process.env.AEON_AIRTIME_PORT || 7800;
const host = process.env.AEON_AIRTIME_URL || "aeon.qa.bltelecoms.net";
const ttl = process.env.TTL || 60000;
const userPin = process.env.AEON_AIRTIME_PIN || "016351";
const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "865181";
const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "w!22!t";

async function doPayment(accountNo, amount, trxId) {
  authXML = ACAdapter.AuthToXML(userPin, deviceId, deviceSer, 'BluBillPayment');

  try {
    const client = await socketClient(host, port, ttl);
    let sessionId;
    await client.request(authXML)
      .then(async serverResponse => {
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Response: ${serverResponse}`, {});
        sessionId = ACAdapter.toJS(serverResponse).SessionId;
      })
      .catch((aeonErrorObject) => {
        client.end();
        return aeonErrorObject;
      });
    let infoXML = dstvAdapter.toXml(accountNo, sessionId, amount, trxId);
    return await client.request(infoXML)
      .then((serverResponse) => {
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Response: ${serverResponse}`, {});
        client.end();
        return dstvAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        client.end();
        return aeonErrorObject;
      });
  } catch (error) {
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Socket Client Error`, { error });
    return error;
  }
}

module.exports = {
  doPayment
}