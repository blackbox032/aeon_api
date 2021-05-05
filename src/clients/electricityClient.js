const logger = require("../utils/logger");
const debug = logger.debug;
const socketClient = require("./sockets/socketClient");
const meterVoucherAdapter = require("../adapters/meterVoucherAdapter");
const meterVoucherFBEAdapter = require("../adapters/meterVoucherFBEAdapter");
const meterConfirmAdapter = require("../adapters/meterConfirmAdapter");
const saleConfirmAdapter = require("../adapters/saleConfirmAdapter");

async function doVerifyMeter({ meterNumber, amount, aeonAuth }) {
  xml = meterConfirmAdapter.toXML(
    aeonAuth.userPin,
    aeonAuth.deviceId,
    aeonAuth.deviceSer,
    meterNumber,
    amount
  );
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
        return meterConfirmAdapter.toJS(serverResponse);
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

async function _doMeterTopUp({ meterNumber, amount = 0, transReference, reference, aeonAuth }, fbe = false) {
  xml = meterConfirmAdapter.toXML(
    aeonAuth.userPin,
    aeonAuth.deviceId,
    aeonAuth.deviceSer,
    meterNumber,
    amount
  );
  logger.log(
    logger.levels.TRACE,
    logger.sources.AEON_API,
    `Aeon API Request: ${xml}`, aeonAuth
  );
  try {
    const client = await socketClient(aeonAuth.host, aeonAuth.port, aeonAuth.ttl);
    return await client
      .request(xml)
      .then(async(verifyResponse) => {
        logger.log(
          logger.levels.TRACE,
          logger.sources.AEON_API,
          `Aeon API Response: ${verifyResponse}`, {}
        );
        response = meterConfirmAdapter.toJS(verifyResponse);
        xml = fbe ?
          meterVoucherFBEAdapter.toXML(
            response.SessionId,
            response.TransRef,
            transReference,
            reference,
            meterNumber
          ) :
          meterVoucherAdapter.toXML(
            response.SessionId,
            response.TransRef,
            transReference,
            reference,
            meterNumber
          );
        logger.log(
          logger.levels.TRACE,
          logger.sources.AEON_API,
          `Aeon API Request: ${xml}`, aeonAuth
        );
        return await client
          .request(xml)
          .then((topupResponse) => {
            logger.log(
              logger.levels.TRACE,
              logger.sources.AEON_API,
              `Aeon API Response: ${topupResponse}`, {}
            );
            client.end();
            return meterVoucherAdapter.toJS(topupResponse);
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

async function doMeterTopUp(aeonParams) {
  return await _doMeterTopUp(aeonParams, false);
}

async function doMeterTopUpFBE(aeonParams) {
  return await _doMeterTopUp(aeonParams, true);
}

async function getSaleConfirmation({ confirmationRef, reference, aeonAuth }) {
  xml = saleConfirmAdapter.toXML(
    aeonAuth.userPin,
    aeonAuth.deviceId,
    aeonAuth.deviceSer,
    confirmationRef,
    reference
  );
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
        return saleConfirmAdapter.toJS(serverResponse);
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
  doVerifyMeter,
  doMeterTopUp,
  doMeterTopUpFBE,
  getSaleConfirmation,
};