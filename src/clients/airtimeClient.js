const logger = require("../utils/logger");
const debug = logger.debug;
const socketClient = require("./sockets/socketClient");
const airtimeTopUpAdapter = require("../adapters/airtimeTopUpAdapter");
const mnoAirtimeValidationAdapter = require("../adapters/mnoAirtimeValidationAdapter");

const port = process.env.AEON_AIRTIME_PORT || 7800;
const host = process.env.AEON_AIRTIME_URL || "aeon.qa.bltelecoms.net";
// const port = process.env.AEON_AIRTIME_PORT || 443;
// const host = process.env.AEON_AIRTIME_URL || "aeonssl.live.bltelecoms.net";
const ttl = process.env.TTL || 60;
const userPin = process.env.AEON_AIRTIME_PIN || "016351";
const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "865181";
const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "w!22!t";
// const userPin = process.env.AEON_AIRTIME_PIN || "011234";
// const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "103936";
// const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "GniRR3t5639!";

async function doAirtimeValidation(transType, reference, phoneNumber, amount, payParams) {
  xml = mnoAirtimeValidationAdapter.toXML(
    userPin,
    deviceId,
    deviceSer,
    transType,
    reference,
    phoneNumber,
    amount,
    payParams
  );
  logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Request: ${xml}`, { host, port });
  try {
    const client = await socketClient(host, port, ttl);
    return await client
      .request(xml)
      .then((serverResponse) => {
        logger.log(
          logger.levels.TRACE,
          logger.sources.AEON_API,
          `Aeon API Response: ${serverResponse}`, {}
        );
        client.end();
        return mnoAirtimeValidationAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        client.end();
        return aeonErrorObject;
      });
  } catch (error) {
    logger.log(
      logger.levels.TRACE,
      logger.sources.AEON_API,
      `Aeon API Socket Client Error`, {
        error,
      }
    );
    return error;
  }
}

async function doAirtimeTopUp(
  transType,
  reference,
  phoneNumber,
  amount,
  transReference,
  payParams,
  retries = 3
) {
  xml = airtimeTopUpAdapter.toXML(
    userPin,
    deviceId,
    deviceSer,
    transType,
    reference,
    phoneNumber,
    amount,
    transReference,
    payParams
  );
  logger.log(
    logger.levels.TRACE,
    logger.sources.AEON_API,
    `Aeon API Request: ${xml}`, { host, port }
  );
  try {
    const client = await socketClient(host, port, ttl);
    return await client
      .request(xml)
      .then((serverResponse) => {
        logger.log(
          logger.levels.TRACE,
          logger.sources.AEON_API,
          `Aeon API Response: ${serverResponse}`, {}
        );
        client.end();
        if (retries < 1) {
          return airtimeTopUpAdapter.toJS(serverResponse);
        }
        switch (airtimeTopUpAdapter.toJS(serverResponse).AeonErrorText) {
          case 'Technical Error':
          case "Supplier offline, please retry":
          case "Supplier Offline":
            return setTimeout(() => doAirtimeTopUp(transType, reference, phoneNumber, amount, transReference, payParams, retries - 1), 5000);
          default:
            return airtimeTopUpAdapter.toJS(serverResponse);
        }
      })
      .catch((aeonErrorObject) => {
        client.end();
        return aeonErrorObject;
      });
  } catch (error) {
    logger.log(
      logger.levels.TRACE,
      logger.sources.AEON_API,
      `Aeon API Socket Client Error`, {
        error,
      }
    );
    return error;
  }
}

module.exports = {
  doAirtimeValidation,
  doAirtimeTopUp,
};