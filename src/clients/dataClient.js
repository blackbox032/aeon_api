const logger = require("../utils/logger");
const debug = logger.debug;
const socketClient = require("./sockets/socketClient");
const bundleTopUpAdapter = require("../adapters/bundleTopUpAdapter");
const productListAdapter = require("../adapters/productListAdapter");
const mnoDataBundleValidationAdapter = require("../adapters/mnoDataBundleValidationAdapter");

const port = process.env.AEON_AIRTIME_PORT || 7800;
const host = process.env.AEON_AIRTIME_URL || "aeon.qa.bltelecoms.net";
const ttl = process.env.TTL || 60000;
const userPin = process.env.AEON_AIRTIME_PIN || "016351";
const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "865181";
const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "w!22!t";

async function getBundleList(transType, aeonParams, aeonAuth) {
  xml = productListAdapter.toXML(aeonAuth.userPin, aeonAuth.deviceId, aeonAuth.deviceSer, transType, aeonParams);
  logger.log(
    logger.levels.TRACE,
    logger.sources.AEON_API,
    `Aeon API Request: ${xml}`, aeonAuth
  );
  try {
    const client = await socketClient(aeonAuth.host, aeonAuth.port, aeonAuth.timeout);
    return await client
      .request(xml)
      .then((serverResponse) => {
        logger.log(
          logger.levels.TRACE,
          logger.sources.AEON_API,
          `Aeon API Response: ${serverResponse}`, {}
        );
        client.end();
        return productListAdapter.toJS(serverResponse);
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

async function doBundleValidation(transType, reference, phoneNumber, product, amount, aeonParams, aeonAuth) {
  xml = mnoDataBundleValidationAdapter.toXML(
    aeonAuth.userPin,
    aeonAuth.deviceId,
    aeonAuth.deviceSer,
    transType,
    reference,
    phoneNumber,
    product,
    amount
  );
  logger.log(
    logger.levels.TRACE,
    logger.sources.AEON_API,
    `Aeon API Request: ${xml}`, aeonAuth
  );
  try {
    const client = await socketClient(aeonAuth.host, aeonAuth.port, aeonAuth.timeout);
    return await client
      .request(xml)
      .then((serverResponse) => {
        logger.log(
          logger.levels.TRACE,
          logger.sources.AEON_API,
          `Aeon API Response: ${serverResponse}`, {}
        );
        client.end();
        return mnoDataBundleValidationAdapter.toJS(serverResponse);
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

async function doBundleTopUp(
  transType,
  reference,
  phoneNumber,
  productCode,
  transReference,
  aeonParams,
  aeonAuth
) {
  xml = bundleTopUpAdapter.toXML(
    aeonAuth.userPin,
    aeonAuth.deviceId,
    aeonAuth.deviceSer,
    transType,
    reference,
    phoneNumber,
    productCode,
    transReference,
    aeonParams
  );
  logger.log(
    logger.levels.TRACE,
    logger.sources.AEON_API,
    `Aeon API Request: ${xml}`, aeonAuth
  );
  try {
    const client = await socketClient(aeonAuth.host, aeonAuth.port, aeonAuth.timeout);
    return await client
      .request(xml)
      .then((serverResponse) => {
        logger.log(
          logger.levels.TRACE,
          logger.sources.AEON_API,
          `Aeon API Response: ${serverResponse}`, {}
        );
        client.end();
        return bundleTopUpAdapter.toJS(serverResponse);
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

module.exports = { doBundleTopUp, doBundleValidation, getBundleList };