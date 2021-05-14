const logger = require("../utils/logger");
const debug = logger.debug;
const socketClient = require("./sockets/socketClient");
const meterVoucherAdapter = require("../adapters/meterVoucherAdapter");
const meterVoucherFBEAdapter = require("../adapters/meterVoucherFBEAdapter");
const meterConfirmAdapter = require("../adapters/meterConfirmAdapter");
const saleConfirmAdapter = require("../adapters/saleConfirmAdapter");

const port = process.env.AEON_ELECTRICITY_PORT || 7893;
const host = process.env.AEON_ELECTRICITY_URL || "196.26.170.3";
const ttl = process.env.TTL || 60000;
const userPin = process.env.AEON_ELECTRICITY_PIN || "011234";
const deviceId = process.env.AEON_ELECTRICITY_DEVICE_ID || "7305";
const deviceSer = process.env.AEON_ELECTRICITY_DEVICE_SER || "TiZZIw779!";

async function doVerifyMeter(meterNumber, amount, aeonParams, aeonAuth) {
  xml = meterConfirmAdapter.toXML(
    aeonAuth.userPin,
    aeonAuth.deviceId,
    aeonAuth.deviceSer,
    meterNumber,
    amount,
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

async function _doMeterTopUp(
  meterNumber,
  amount,
  transReference,
  reference,
  fbe = false,
  aeonParams,
  aeonAuth
) {
  xml = meterConfirmAdapter.toXML(
    aeonAuth.userPin,
    aeonAuth.deviceId,
    aeonAuth.deviceSer,
    meterNumber,
    amount,
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
            meterNumber,
            aeonParams,
            aeonAuth
          ) :
          meterVoucherAdapter.toXML(
            response.SessionId,
            response.TransRef,
            transReference,
            reference,
            meterNumber,
            aeonParams,
            aeonAuth
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

async function doMeterTopUp(meterNumber, amount, transReference, reference, isFBE, aeonParams, aeonAuth) {
  return await _doMeterTopUp(meterNumber, amount, transReference, reference, false, aeonParams, aeonAuth);
}

async function doMeterTopUpFBE(meterNumber, transReference, reference, isFBE, aeonParams, aeonAuth) {
  return await _doMeterTopUp(meterNumber, 0, transReference, reference, true, aeonParams, aeonAuth);
}

async function getSaleConfirmation(confirmationRef, reference, aeonParams, aeonAuth) {
  xml = saleConfirmAdapter.toXML(
    aeonAuth.userPin,
    aeonAuth.deviceId,
    aeonAuth.deviceSer,
    confirmationRef,
    reference,
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