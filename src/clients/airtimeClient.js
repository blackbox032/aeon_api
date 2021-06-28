const logger = require("../utils/logger");
const socketClient = require("./sockets/socketClient");
const airtimeTopUpAdapter = require("../adapters/airtimeTopUpAdapter");
const mnoAirtimeValidationAdapter = require("../adapters/mnoAirtimeValidationAdapter");
const db_api = require('../db/db_api');
const AIRTIME_VALIDATE = 'atval';
const AIRTIME_TOPUP = 'atbuy';

async function doAirtimeValidation(aeonAuth, aeonParams) {
  let reqXML = mnoAirtimeValidationAdapter.toXML(aeonAuth, aeonParams);
  logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Request: ${reqXML}`, aeonAuth);
  try {
    const client = await socketClient(aeonAuth, aeonParams);
    const requestAt = Date.now();
    return await client
      .request(reqXML)
      .then((resXML) => {
        const resTime = Date.now() - requestAt;
        client.end();
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Response: ${resXML}`, {});
        const resJSON = mnoAirtimeValidationAdapter.toJS(resXML);
        db_api.log_socket_time_ms(client.socket_id, resTime);
        db_api.log_req_res(client.socket_id, AIRTIME_VALIDATE, requestAt, resTime, aeonParams, resJSON, reqXML, resXML)
        return resJSON;
      })
      .catch((aeonErrorObject) => {
        const resTime = Date.now() - requestAt;
        client.end();
        db_api.log_socket_time_ms(client.socket_id, resTime);
        db_api.log_req_res(client.socket_id, AIRTIME_VALIDATE, requestAt, resTime, aeonParams, aeonErrorObject, reqXML)
        return aeonErrorObject;
      });
  } catch (error) {
    console.log(error);
    db_api.log_socket_time_ms(client.socket_id, resTime);
    db_api.log_req_res(undefined, AIRTIME_VALIDATE, undefined, Date.now(), aeonParams, { error: error.message })
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Socket Client Error`, { error });
    return error;
  }
}

async function doAirtimeTopUp(aeonAuth, aeonParams, bankRes) {
  let reqXML = airtimeTopUpAdapter.toXML(aeonAuth, aeonParams, bankRes);
  logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Request: ${reqXML}`, aeonAuth);
  try {
    const client = await socketClient(aeonAuth, aeonParams);
    const requestAt = Date.now();
    return await client
      .request(reqXML)
      .then((resXML) => {
        const resTime = Date.now() - requestAt;
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Response: ${resXML}`, {});
        client.end();
        const resJSON = airtimeTopUpAdapter.toJS(resXML);
        db_api.log_socket_time_ms(client.socket_id, resTime);
        db_api.log_req_res(client.socket_id, AIRTIME_TOPUP, requestAt, resTime, aeonParams, resJSON, reqXML, resXML)
        return resJSON;
      })
      .catch((aeonErrorObject) => {
        const resTime = Date.now() - requestAt;
        client.end();
        db_api.log_socket_time_ms(client.socket_id, resTime);
        db_api.log_req_res(client.socket_id, AIRTIME_TOPUP, requestAt, resTime, aeonParams, aeonErrorObject, reqXML)
        return aeonErrorObject;
      });
  } catch (error) {
    console.log(error)
    db_api.log_req_res(undefined, undefined, Date.now(), aeonParams, { error: error.message })
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Socket Client Error`, { error });
    return error;
  }
}

module.exports = {
  doAirtimeValidation,
  doAirtimeTopUp,
};