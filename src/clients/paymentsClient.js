const logger = require("../utils/logger");
const socketClient = require("../clients/sockets/socketClient");
const paymentAdapter = require("../adapters/paymentAdapter");

const port = process.env.AEON_AIRTIME_PORT || 7800;
const host = process.env.AEON_AIRTIME_URL || "aeon.qa.bltelecoms.net";
const ttl = process.env.TTL_PAYMENT || 180000;
const userPin = process.env.AEON_AIRTIME_PIN || "016351";
const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "865181";
const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "w!22!t";

async function doPayment(accountNo, amount, aeonParams, aeonAuth) {
  authXML = paymentAdapter.authToXML(aeonAuth.userPin, aeonAuth.deviceId, aeonAuth.deviceSer, aeonParams);
  let isConfirmAPI = false;
  try {
    const client = await socketClient(aeonAuth.host, aeonAuth.port, aeonAuth.timeout);
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Auth Req: ${authXML}`, {});
    const authResp = await client.request(authXML)
      .then(async serverResponse => {
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Auth Res: ${serverResponse}`, {});
        return paymentAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        client.end();
        return {...aeonErrorObject, isConfirmAPI };
      });

    if (authResp.error) {
      client.end();
      return authResp;
    }
    let infoXML = paymentAdapter.subscriberInfoToXML(accountNo, authResp.SessionId, aeonParams, amount);
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Subscriber Req: ${infoXML}`, {});
    const subscriberResp = await client.request(infoXML)
      .then((serverResponse) => {
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Subscriber Res: ${serverResponse}`, {});
        return paymentAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        client.end();
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
    return await client.request(payXML)
      .then((serverResponse) => {
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API payXML Res: ${serverResponse}`, {});
        client.end();
        return paymentAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        client.end();
        return {...aeonErrorObject, isConfirmAPI };
      });
  } catch (error) {
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Socket Client Error`, { error });
    return error;
  }
}

async function doGetSubscriberInfo(accountNo, aeonParams, aeonAuth) {
  authXML = paymentAdapter.authToXML(aeonAuth.userPin, aeonAuth.deviceId, aeonAuth.deviceSer, aeonParams);

  try {
    const client = await socketClient(aeonAuth.host, aeonAuth.port, aeonAuth.timeout);
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Auth Req: ${authXML}`, {});
    const authResp = await client.request(authXML)
      .then(async serverResponse => {
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Auth Res: ${serverResponse}`, {});
        return paymentAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        client.end();
        return aeonErrorObject;
      });

    if (authResp.error) {
      client.end();
      return authResp;
    }
    let infoXML = paymentAdapter.subscriberInfoToXML(accountNo, authResp.SessionId, aeonParams);
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Subscriber Req: ${infoXML}`, {});
    const subscriberResp = await client.request(infoXML)
      .then((serverResponse) => {
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Subscriber Res: ${serverResponse}`, {});
        client.end();
        return paymentAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        client.end();
        return aeonErrorObject;
      });

    return subscriberResp;

  } catch (error) {
    console.log(error)
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Socket Client Error`, { error });
    return error;
  }
}

module.exports = {
  doPayment,
  doGetSubscriberInfo
}