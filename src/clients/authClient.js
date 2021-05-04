const logger = require("../utils/logger");
const debug = logger.debug;
// const mnoAirtimeValidationAdapter = require("../adapters/mnoAirtimeValidationAdapter");
const doAuthAdapter = require("../adapters/authAdapter");

const port = process.env.AEON_AIRTIME_PORT || 7800;
const host = process.env.AEON_AIRTIME_URL || '102.134.128.70'; //"aeon.qa.bltelecoms.net";
// const port = process.env.AEON_AIRTIME_PORT || 443;
// const host = process.env.AEON_AIRTIME_URL || "aeonssl.live.bltelecoms.net";
const ttl = process.env.TTL || 180000;
const userPin = process.env.AEON_AIRTIME_PIN || "016351";
const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "865181";
const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "w!22!t";
// const userPin = process.env.AEON_AIRTIME_PIN || "011234";
// const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "103936";
// const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "GniRR3t5639!";


async function doAuth(transType) {
  xml = doAuthAdapter.toXML(userPin, deviceId, deviceSer, transType);
  logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Request: ${xml}`, { host, port });
  try {
    const client = await socketClient(host, port, ttl);

    return await client
      .request(xml)
      .then((serverResponse) => {
        console.log(`Aeon API Response: ${serverResponse}`)
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Response: ${serverResponse}`, {});
        // client.end();
        return doAuthAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        console.log(`Aeon API aeonErrorObject Response: ${aeonErrorObject}`)

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