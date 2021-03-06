const logger = require("../utils/logger");
const debug = logger.debug;
const socketClient = require("../clients/sockets/socketClient");
const dstvGetSubscriberInfo = require("../adapters/dstvGetSubscriberInfo");
const mnoAirtimeValidationAdapter = require("../adapters/mnoAirtimeValidationAdapter");
const doAuthAdapter = require("../adapters/doAuthAdapter");

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
const db_api = require('../db/db_api');


async function doAuth(aeonAuth, aeonParams) {
  reqXML = doAuthAdapter.toXML(aeonAuth.userPin, aeonAuth.deviceId, aeonAuth.deviceSer, transType);
  logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Request: ${reqXML}`, aeonAuth);
  try {
    const client = await socketClient(aeonAuth, aeonParams);
    return await client
      .request(reqXML)
      .then((resXML) => {
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Response: ${resXML}`, {});
        client.end();
        return doAuthAdapter.toJS(resXML);
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
  doAuth,
};