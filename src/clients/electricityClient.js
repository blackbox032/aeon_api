const logger = require("../utils/logger");
const debug = logger.debug;
const socketClient = require("./sockets/socketClient");
const meterVoucherAdapter = require("../adapters/meterVoucherAdapter");
const meterVoucherFBEAdapter = require("../adapters/meterVoucherFBEAdapter");
const meterConfirmAdapter = require("../adapters/meterConfirmAdapter");
const saleConfirmAdapter = require("../adapters/saleConfirmAdapter");

const db_api = require('../db/db_api');


async function doVerifyMeter(aeonAuth, aeonParams) {
  reqXML = meterConfirmAdapter.toXML(aeonAuth, aeonParams);
  logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Request: ${xml}`, aeonAuth);
  try {
    const client = await socketClient(aeonAuth, aeonParams);
    return await client
      .request(reqXML)
      .then((resXML) => {
        const resTime = Date.now() - requestAt;
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Response: ${resXML}`, {});
        client.end();
        const resJSON = meterConfirmAdapter.toJS(resXML);
        db_api.log_req_res(client.socket_id, requestAt, resTime, aeonParams, aeonErrorObject, reqXML)
        return resJSON;
      })
      .catch((aeonErrorObject) => {
        client.end();
        return aeonErrorObject;
      });
  } catch (error) {
    db_api.log_req_res(undefined, undefined, Date.now(), aeonParams, { error: error.message })
    return error;
  }
}

async function _doMeterTopUp(aeonAuth, aeonParams, fbe = false) {
  const reqXML = meterConfirmAdapter.toXML(aeonAuth, aeonParams);
  logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Request: ${xml}`, aeonAuth);
  try {
    const client = await socketClient(aeonAuth, aeonParams);
    const requestAt = Date.now();
    return await client
      .request(reqXML)
      .then(async(verifyResponse) => {
        const resTime = Date.now() - requestAt;
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Response: ${verifyResponse}`, {});
        response = meterConfirmAdapter.toJS(verifyResponse);
        xml = fbe ?
          meterVoucherFBEAdapter.toXML(response.SessionId, response.TransRef, aeonParams, aeonAuth) :
          meterVoucherAdapter.toXML(response.SessionId, response.TransRef, transReference, aeonParams, aeonAuth);
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Request: ${xml}`, aeonAuth);
        db_api.log_req_res(client.socket_id, requestAt, resTime, aeonParams, response, reqXML, verifyResponse)
        const topUpAt = Date.now();
        return await client
          .request(xml)
          .then((topupResponse) => {
            const resTime = Date.now() - requestAt;
            logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Response: ${topupResponse}`, {});
            client.end();
            const resJSON = meterVoucherAdapter.toJS(topupResponse);
            db_api.log_req_res(client.socket_id, topUpAt, resTime, aeonAuth, aeonParams, resJSON, xml, topupResponse)
            return resJSON;
          })
          .catch((aeonErrorObject) => {
            client.end();
            db_api.log_req_res(client.socket_id, requestAt, resTime, aeonParams, aeonErrorObject, xml)
            return aeonErrorObject;
          });
      })
      .catch((aeonErrorObject) => {
        debug("Error: " + aeonErrorObject);
        client.end();
        db_api.log_req_res(client.socket_id, requestAt, resTime, aeonParams, aeonErrorObject, reqXML)
        return aeonErrorObject;
      });
  } catch (error) {
    db_api.log_req_res(undefined, undefined, Date.now(), aeonParams, { error: error.message })
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Socket Client Error`, {
      error
    });
    return error;
  }
}

async function doMeterTopUp(aeonAuth, aeonParams) {
  return await _doMeterTopUp(aeonAuth, aeonParams);
}

async function doMeterTopUpFBE(aeonAuth, aeonParams) {
  return await _doMeterTopUp(aeonAuth, aeonParams, true);
}

async function getSaleConfirmation(aeonAuth, aeonAuth) {
  xml = saleConfirmAdapter.toXML(aeonAuth, aeonParams);
  logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Request: ${xml}`, aeonAuth);
  try {
    const client = await socketClient(aeonAuth.host, aeonAuth.port, aeonAuth.timeout, aeonParams.fromAccount);
    const requestAt = Date.now();
    return await client
      .request(xml)
      .then((resXML) => {
        const resTime = Date.now() - requestAt;
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Response: ${resXML}`, {});
        client.end();
        const resJSON = saleConfirmAdapter.toJS(resXML);
        db_api.log_req_res(client.socket_id, requestAt, resTime, aeonParams, aeonErrorObject, reqXML)
        return resJSON;
      })
      .catch((aeonErrorObject) => {
        const resTime = Date.now() - requestAt;
        client.end();
        db_api.log_req_res(client.socket_id, requestAt, resTime, aeonParams, aeonErrorObject, reqXML)
        return aeonErrorObject;
      });
  } catch (error) {
    db_api.log_req_res(undefined, undefined, Date.now(), aeonParams, { error: error.message })
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Socket Client Error`, { error });
    return error;
  }
}

module.exports = {
  doVerifyMeter,
  doMeterTopUp,
  doMeterTopUpFBE,
  getSaleConfirmation,
};