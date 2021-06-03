const logger = require("../utils/logger");
const socketClient = require("../clients/sockets/socketClient");
const paymentAdapter = require("../adapters/paymentAdapter");

const db_api = require('../db/db_api');


async function doPayment(aeonAuth, aeonParams) {
  authXML = paymentAdapter.authToXML(aeonAuth.userPin, aeonAuth.deviceId, aeonAuth.deviceSer, aeonParams);
  let isConfirmAPI = false;
  try {
    const client = await socketClient(aeonAuth.host, aeonAuth.port, aeonAuth.timeout, aeonParams.fromAccount);
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Auth Req: ${authXML}`, {});
    const requestAt = Date.now();
    const authResp = await client.request(authXML)
      .then(async resXML => {
        const resTime = Date.now() - requestAt;
        const resJSON = paymentAdapter.toJS(resXML);
        db_api.log_req_res(client.socket_id, requestAt, resTime, aeonParams, resJSON, reqXML, resXML)
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Auth Res: ${resXML}`, {});
        return resJSON;
      })
      .catch((aeonErrorObject) => {
        const resTime = Date.now();
        client.end();
        db_api.log_req_res(client.socket_id, requestAt, resTime, aeonParams, aeonErrorObject, reqXML)
        return {...aeonErrorObject, isConfirmAPI };
      });

    if (authResp.error) {
      client.end();
      return authResp;
    }

    let infoXML = paymentAdapter.subscriberInfoToXML(accountNo, authResp.SessionId, aeonParams, amount);
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Subscriber Req: ${infoXML}`, {});
    const subscriberAt = Date.now();
    const subscriberResp = await client.request(infoXML)
      .then((resXML) => {
        const resTime = Date.now() - subscriberAt;
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Subscriber Res: ${resXML}`, {});
        db_api.log_req_res(client.socket_id, subscriberAt, resTime, aeonAuth, aeonParams, resJSON, reqXML, resXML)
        return paymentAdapter.toJS(resXML);
      })
      .catch((aeonErrorObject) => {
        const resTime = Date.now() - subscriberAt;
        client.end();
        db_api.log_req_res(client.socket_id, requestAt, resTime, aeonParams, aeonErrorObject, reqXML);
        return {...aeonErrorObject, isConfirmAPI };
      });

    if (subscriberResp.error) {
      client.end();
      return subscriberResp;
    }

    aeonParams.trxID = subscriberResp.TransRef;
    isConfirmAPI = true;
    let payXML = paymentAdapter.paymentToXML(accountNo, amount, authResp.SessionId, aeonParams);
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API payXML Req: ${payXML}`, {});
    const payAt = Date.now();
    return await client.request(payXML)
      .then((resXML) => {
        const resTime = Date.now() - payAt;
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API payXML Res: ${resXML}`, {});
        client.end();
        const resJSON = paymentAdapter.toJS(resXML);
        db_api.log_req_res(client.socket_id, requestAt, resTime, aeonParams, resJSON, payXML, resXML)
        return resJSON;
      })
      .catch((aeonErrorObject) => {
        const resTime = Date.now() - payAt;
        client.end();
        db_api.log_req_res(client.socket_id, requestAt, resTime, aeonParams, aeonErrorObject, reqXML)
        return {...aeonErrorObject, isConfirmAPI };
      });
  } catch (error) {
    db_api.log_req_res(undefined, undefined, Date.now(), aeonParams, { error: error.message })
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Socket Client Error`, { error });
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
        const resTime = Date.now();
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Auth Res: ${resXML}`, {});
        const resJSON = paymentAdapter.toJS(resXML);
        db_api.log_req_res(client.socket_id, requestAt, resTime, aeonParams, resJSON, reqXML, resXML)
        return resJSON;
      })
      .catch((aeonErrorObject) => {
        const resTime = Date.now();
        client.end();
        db_api.log_req_res(client.socket_id, requestAt, resTime, aeonParams, aeonErrorObject, reqXML);
        return aeonErrorObject;
      });

    if (authResp.error) {
      client.end();
      return authResp;
    }
    let infoXML = paymentAdapter.subscriberInfoToXML(accountNo, authResp.SessionId, aeonParams);
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Subscriber Req: ${infoXML}`, {});
    const subscriberAt = Date.now();
    const subscriberResp = await client.request(infoXML)
      .then((resXML) => {
        const resTime = Date.now() - subscriberAt;
        const resJSON = paymentAdapter.toJS(resXML);
        db_api.log_req_res(client.socket_id, requestAt, resTime, aeonParams, resJSON, reqXML, resXML)
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Subscriber Res: ${resXML}`, {});
        client.end();
        return resJSON;
      })
      .catch((aeonErrorObject) => {
        db_api.log_req_res(client.socket_id, requestAt, Date.now(), aeonAuth, aeonParams, aeonErrorObject, reqXML)
        client.end();
        return aeonErrorObject;
      });

    return subscriberResp;

  } catch (error) {
    db_api.log_req_res(undefined, undefined, Date.now(), aeonParams, { error: error.message })
    console.log(error)
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Socket Client Error`, { error });
    return error;
  }
}

module.exports = {
  doPayment,
  doGetSubscriberInfo
}