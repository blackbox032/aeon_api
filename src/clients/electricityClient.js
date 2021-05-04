const logger = require("../utils/logger");
const debug = logger.debug;
const socketClient = require("./sockets/socketClient");
const meterVoucherAdapter = require("../adapters/meterVoucherAdapter");
const meterVoucherFBEAdapter = require("../adapters/meterVoucherFBEAdapter");
const meterConfirmAdapter = require("../adapters/meterConfirmAdapter");
const saleConfirmAdapter = require("../adapters/saleConfirmAdapter");

const port = process.env.AEON_ELECTRICITY_PORT || 7893;
const host = process.env.AEON_ELECTRICITY_URL || "196.26.170.3";
// const ttl = process.env.TTL || 100;
const ttl = 17;
const userPin = process.env.AEON_ELECTRICITY_PIN || "011234";
const deviceId = process.env.AEON_ELECTRICITY_DEVICE_ID || "7305";
const deviceSer = process.env.AEON_ELECTRICITY_DEVICE_SER || "TiZZIw779!";

async function doVerifyMeter(meterNumber, amount, payParams) {
  xml = meterConfirmAdapter.toXML(
    userPin,
    deviceId,
    deviceSer,
    meterNumber,
    amount,
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

async function _doMeterTopUp(meterNumber, amount, transReference, reference, fbe = false, payParams, retries = 3, isTimeoutRetry = false) {
  xml = meterConfirmAdapter.toXML(
    userPin,
    deviceId,
    deviceSer,
    meterNumber,
    amount,
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
            payParams
          ) :
          meterVoucherAdapter.toXML(
            response.SessionId,
            response.TransRef,
            transReference,
            reference,
            meterNumber,
            payParams
          );
        logger.log(
          logger.levels.TRACE,
          logger.sources.AEON_API,
          `Aeon API Request: ${xml}`, { host, port }
        );
        return await client
          .request(xml)
          .then((topupResponse) => {
            logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Response: ${topupResponse}`, {});
            client.end();
            // if (!isTimeoutRetry && aeonErrorObject.AeonErrorText == 'Communication error') {
            //   console.log('1. this logic works topupResponse', isTimeoutRetry)
            //   return _doMeterTopUp(accountNo, amount, payParams, undefined, true);
            // }
            // console.log('2. this logic works too topupResponse', isTimeoutRetry)
            // return aeonErrorObject;
            return meterVoucherAdapter.toJS(topupResponse);
          })
          .catch((aeonErrorObject) => {
            client.end();
            return aeonErrorObject;
          });
      })
      .catch(async(aeonErrorObject) => {
        debug("Error: " + JSON.stringify(aeonErrorObject));
        client.end();
        if (!isTimeoutRetry && aeonErrorObject.AeonErrorText == 'Communication error') {
          console.log('1. this logic works verifyResponse', isTimeoutRetry)
            // get trx reprint
          const client = await socketClient(host, port, ttl);
          return await client
            .request(xml)
            .then(async(verifyResponse) => {


              return _doMeterTopUp(meterNumber, amount, transReference, reference, fbe, payParams, retries, true);

            })
            .catch((aeonErrorObject) => {
              client.end();
              return aeonErrorObject;
            });

          // if success, then return it, else retry



        }
        console.log('2. this logic works too verifyResponse', isTimeoutRetry)
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

async function doMeterTopUp(meterNumber, amount, transReference, reference, isFBE, payParams) {
  return await _doMeterTopUp(meterNumber, amount, transReference, reference, false, payParams);
}

async function doMeterTopUpFBE(meterNumber, transReference, reference, isFBE, payParams) {
  return await _doMeterTopUp(meterNumber, 0, transReference, reference, true, payParams);
}

async function getSaleConfirmation(confirmationRef, reference, payParams, retries = 3) {
  xml = saleConfirmAdapter.toXML(
    userPin,
    deviceId,
    deviceSer,
    confirmationRef,
    reference,
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
          return saleConfirmAdapter.toJS(serverResponse);
        }
        switch (saleConfirmAdapter.toJS(serverResponse).AeonErrorText) {
          case 'Technical Error':
          case "Supplier offline, please retry":
          case "Supplier Offline":
            return setTimeout(() => getSaleConfirmation(confirmationRef, reference, payParams, retries - 1), 5000);
          default:
            return saleConfirmAdapter.toJS(serverResponse);
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
  doVerifyMeter,
  doMeterTopUp,
  doMeterTopUpFBE,
  getSaleConfirmation,
};