const logger = require("../utils/logger");
const socketClient = require("./sockets/socketClient");
const bundleTopUpAdapter = require("../adapters/bundleTopUpAdapter");
const productListAdapter = require("../adapters/productListAdapter");
const mnoDataBundleValidationAdapter = require("../adapters/mnoDataBundleValidationAdapter");
const db_api = require('../db/db_api');
const GET_BUNDLES = 'gbndl'
const VALIDATE_BUNDLES = 'vbndl'
const TOPUP_BUNDLES = 'tbndl'

async function getBundleList(aeonAuth, aeonParams) {
  reqXML = productListAdapter.toXML(aeonAuth, aeonParams);
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
        const resJSON = productListAdapter.toJS(resXML);
        db_api.log_req_res(client.socket_id, GET_BUNDLES, requestAt, resTime, aeonParams, resJSON, reqXML, resXML)
        return resJSON;
      })
      .catch((aeonErrorObject) => {
        const resTime = Date.now() - requestAt;
        client.end();
        db_api.log_req_res(client.socket_id, GET_BUNDLES, requestAt, resTime, aeonParams, resJSON, reqXML, resXML)
        return aeonErrorObject;
      });
  } catch (error) {
    db_api.log_req_res(undefined, GET_BUNDLES, undefined, undefined, aeonAuth, aeonParams, { error: error.message })
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Socket Client Error`, { error });
    return error;
  }
}

async function doBundleValidation(aeonAuth, aeonParams) {
  reqXML = mnoDataBundleValidationAdapter.toXML(aeonAuth, aeonParams);
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
        const resJSON = mnoDataBundleValidationAdapter.toJS(resXML);
        db_api.log_req_res(client.socket_id, VALIDATE_BUNDLES, requestAt, resTime, aeonParams, resJSON, reqXML, resXML)
        return resJSON;
      })
      .catch((aeonErrorObject) => {
        const resTime = Date.now() - requestAt;
        db_api.log_req_res(client.socket_id, VALIDATE_BUNDLES, requestAt, resTime, aeonParams, aeonErrorObject, reqXML)
        client.end();
        return aeonErrorObject;
      });
  } catch (error) {
    db_api.log_req_res(undefined, VALIDATE_BUNDLES, Date.now(), aeonParams, { error: error.message })
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Socket Client Error`, { error });
    return error;
  }
}

async function doBundleTopUp(aeonAuth, aeonParams) {
  reqXML = bundleTopUpAdapter.toXML(aeonAuth, aeonParams);
  logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Request: ${reqXML}`, aeonAuth);
  try {
    const client = await socketClient(aeonAuth.host, aeonAuth.port, aeonAuth.timeout, phoneNumber);
    const requestAt = Date.now();
    return await client
      .request(reqXML)
      .then((resXML) => {
        const resTime = Date.now() - requestAt;
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Response: ${resXML}`, {});
        client.end();
        const resJSON = bundleTopUpAdapter.toJS(resXML);
        db_api.log_req_res(client.socket_id, TOPUP_BUNDLES, requestAt, resTime, aeonParams, resJSON, reqXML, resXML)
        return resJSON;
      })
      .catch((aeonErrorObject) => {
        const resTime = Date.now() - requestAt;
        client.end();
        db_api.log_req_res(client.socket_id, TOPUP_BUNDLES, requestAt, resTime, aeonParams, aeonErrorObject, reqXML)
        return aeonErrorObject;
      });
  } catch (error) {
    db_api.log_req_res(undefined, TOPUP_BUNDLES, Date.now(), aeonParams, { error: error.message })
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Socket Client Error`, { error });
    return error;
  }
}

module.exports = { doBundleTopUp, doBundleValidation, getBundleList };