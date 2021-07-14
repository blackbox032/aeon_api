const logger = require("../utils/logger");
const socketClient = require("../clients/sockets/socketClient");
const paymentAdapter = require("../adapters/paymentAdapter");

const db_api = require('../db/db_api');

const PAYMENT_AUTH = 'apay';
const PAYMENT_INFO = 'ipay';
const PAYMENT_PAY = 'ppay';

async function doPayment(aeonAuth, aeonParams, bankResp) {
  let apiStep = PAYMENT_AUTH;
  authXML = paymentAdapter.authToXML(aeonAuth, aeonParams);
  let isConfirmAPI = false;
  try {
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Auth Req: ${authXML}`, {});
    const client = await socketClient(aeonAuth, aeonParams);
    const requestAt = Date.now();
    const authResp = await client.request(authXML)
      .then(async resXML => {
        const resTime = Date.now() - requestAt;
        const resJSON = paymentAdapter.toJS(resXML);
        db_api.log_socket_time_ms(client.socket_id, resTime);
        db_api.log_req_res(client.socket_id, PAYMENT_AUTH, requestAt, resTime, aeonParams, resJSON, reqXML, resXML)
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Auth Res: ${resXML}`, {});
        return resJSON;
      })
      .catch((aeonErrorObject) => {
        const resTime = Date.now() - requestAt;;
        client.end();
        db_api.log_socket_time_ms(client.socket_id, resTime);
        db_api.log_req_res(client.socket_id, PAYMENT_AUTH, requestAt, resTime, aeonParams, aeonErrorObject, reqXML)
        return {...aeonErrorObject, isConfirmAPI };
      });

    if (authResp.error) {
      client.end();
      return authResp;
    }

    apiStep = PAYMENT_INFO;
    let infoXML = paymentAdapter.subscriberInfoToXML(authResp.SessionId, aeonParams);
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Subscriber Req: ${infoXML}`, {});
    const subscriberAt = Date.now();
    const subscriberResp = await client.request(infoXML)
      .then((resXML) => {
        const resTime = Date.now() - subscriberAt;
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Subscriber Res: ${resXML}`, {});
        const resJSON = paymentAdapter.toJS(resXML);
        db_api.log_socket_time_ms(client.socket_id, Date.now() - requestAt);
        db_api.log_req_res(client.socket_id, PAYMENT_INFO, subscriberAt, resTime, aeonParams, resJSON, reqXML, resXML);
        return resJSON;
      })
      .catch((aeonErrorObject) => {
        const resTime = Date.now() - subscriberAt;
        client.end();
        db_api.log_socket_time_ms(client.socket_id, Date.now() - requestAt);
        db_api.log_req_res(client.socket_id, PAYMENT_INFO, subscriberAt, resTime, aeonParams, aeonErrorObject, reqXML);
        return {...aeonErrorObject, isConfirmAPI };
      });

    if (subscriberResp.error) {
      client.end();
      return subscriberResp;
    }

    apiStep = PAYMENT_PAY;
    aeonParams.trxID = subscriberResp.TransRef;
    isConfirmAPI = true;
    let payXML = paymentAdapter.paymentToXML(authResp.SessionId, aeonParams, bankResp);
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API payXML Req: ${payXML}`, {});
    const payAt = Date.now();
    return await client.request(payXML)
      .then((resXML) => {
        const resTime = Date.now() - payAt;
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API payXML Res: ${resXML}`, {});
        client.end();
        const resJSON = paymentAdapter.toJS(resXML);
        db_api.log_socket_time_ms(client.socket_id, Date.now() - requestAt);
        db_api.log_req_res(client.socket_id, PAYMENT_PAY, requestAt, resTime, aeonParams, resJSON, payXML, resXML)
        return resJSON;
      })
      .catch((aeonErrorObject) => {
        const resTime = Date.now() - payAt;
        client.end();
        db_api.log_socket_time_ms(client.socket_id, Date.now() - requestAt);
        db_api.log_req_res(client.socket_id, PAYMENT_PAY, requestAt, resTime, aeonParams, aeonErrorObject, reqXML)
        return {...aeonErrorObject, isConfirmAPI };
      });
  } catch (error) {
    console.log(error)
    db_api.log_req_res(undefined, apiStep, Date.now(), aeonParams, { error: error.message })
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Socket Client Error`, { error: error.message });
    return error;
  }
}

async function doGetSubscriberInfo(aeonAuth, aeonParams) {
  try {
    authXML = paymentAdapter.authToXML(aeonAuth, aeonParams);
    const client = await socketClient(aeonAuth, aeonParams);
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Auth Req: ${authXML}`, {});
    const requestAt = Date.now();
    const authResp = await client.request(authXML)
      .then(async resXML => {
        const resTime = Date.now() - requestAt;
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Auth Res: ${resXML}`, {});
        const resJSON = paymentAdapter.toJS(resXML);
        db_api.log_socket_time_ms(client.socket_id, resTime);
        db_api.log_req_res(client.socket_id, PAYMENT_AUTH, requestAt, resTime, aeonParams, resJSON, authXML, resXML)
        return resJSON;
      })
      .catch((aeonErrorObject) => {
        const resTime = Date.now() - requestAt;
        client.end();
        db_api.log_socket_time_ms(client.socket_id, resTime);
        db_api.log_req_res(client.socket_id, PAYMENT_AUTH, requestAt, resTime, aeonParams, aeonErrorObject, authXML);
        return aeonErrorObject;
      });

    if (authResp.error) {
      client.end();
      return authResp;
    }
    let infoXML = paymentAdapter.subscriberInfoToXML(authResp.SessionId, aeonParams);
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Subscriber Req: ${infoXML}`, {});
    const subscriberAt = Date.now();
    const subscriberResp = await client.request(infoXML)
      .then((resXML) => {
        const resTime = Date.now() - subscriberAt;
        const resJSON = paymentAdapter.toJS(resXML);
        db_api.log_socket_time_ms(client.socket_id, Date.now() - requestAt);
        db_api.log_req_res(client.socket_id, PAYMENT_INFO, subscriberAt, resTime, aeonParams, resJSON, infoXML, resXML)
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Subscriber Res: ${resXML}`, {});
        client.end();
        return resJSON;
      })
      .catch((aeonErrorObject) => {
        db_api.log_socket_time_ms(client.socket_id, Date.now() - requestAt);
        db_api.log_req_res(client.socket_id, PAYMENT_INFO, subscriberAt, Date.now(), aeonAuth, aeonParams, aeonErrorObject, infoXML)
        client.end();
        return aeonErrorObject;
      });

    return subscriberResp;

  } catch (error) {
    db_api.log_req_res(undefined, PAYMENT_INFO, Date.now(), aeonParams, { error: error.message })
    console.log(error)
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Socket Client Error`, { error });
    return error;
  }
}

module.exports = {
  doPayment,
  doGetSubscriberInfo
}