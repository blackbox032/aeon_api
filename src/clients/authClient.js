const logger = require("../utils/logger");
const debug = logger.debug;
const socketClient = require("../clients/sockets/socketClient");
const dstvGetSubscriberInfo = require("../adapters/dstvGetSubscriberInfo");
const mnoAirtimeValidationAdapter = require("../adapters/mnoAirtimeValidationAdapter");
const doAuthAdapter = require("../adapters/doAuthAdapter");


async function doAuth({ transType, aeonAuth }) {
  xml = doAuthAdapter.toXML(aeonAuth.userPin, aeonAuth.deviceId, aeonAuth.deviceSer, transType);
  logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Request: ${xml}`, aeonAuth);
  try {
    const client = await socketClient(aeonAuth.host, aeonAuth.port, aeonAuth.ttl);
    return await client
      .request(xml)
      .then((serverResponse) => {
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Response: ${serverResponse}`, {});
        client.end();
        return doAuthAdapter.toJS(serverResponse);
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