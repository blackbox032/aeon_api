const logger = require("../utils/logger");
const debug = logger.debug;
const socketClient = require("./sockets/socketClient");
const bundleTopUpAdapter = require("../adapters/bundleTopUpAdapter");
const productListAdapter = require("../adapters/productListAdapter");
const mnoDataBundleValidationAdapter = require("../adapters/mnoDataBundleValidationAdapter");

async function getBundleList({ transType, aeonAuth }) {
  xml = productListAdapter.toXML(aeonAuth.userPin, aeonAuth.deviceId, aeonAuth.deviceSer, transType);
  logger.log(
    logger.levels.TRACE,
    logger.sources.AEON_API,
    `Aeon API Request: ${xml}`, aeonAuth
  );
  try {
    const client = await socketClient(aeonAuth.host, aeonAuth.port, aeonAuth.ttl);
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

async function doBundleValidation(aeonParams) {
  const { transType, reference, phoneNumber, product, amount, aeonAuth } = aeonParams
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
    `Aeon API Request: ${xml}`, { host, port }
  );
  try {
    const client = await socketClient(aeonAuth.host, aeonAuth.port, aeonAuth.ttl);
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

async function doBundleTopUp(aeonParams) {
  const { transType, reference, phoneNumber, productCode, transReference } = aeonParams;
  xml = bundleTopUpAdapter.toXML(
    userPin,
    deviceId,
    deviceSer,
    transType,
    reference,
    phoneNumber,
    productCode,
    transReference
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