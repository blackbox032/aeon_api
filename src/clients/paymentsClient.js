const logger = require("../utils/logger");
const socketClient = require("../clients/sockets/socketClient");
const paymentAdapter = require("../adapters/paymentAdapter");

const port = process.env.AEON_AIRTIME_PORT || 7800;
const host = process.env.AEON_AIRTIME_URL || "aeon.qa.bltelecoms.net";
const ttl = process.env.TTL || 60000;
const userPin = process.env.AEON_AIRTIME_PIN || "016351";
const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "865181";
const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "w!22!t";

async function doPayment(accountNo, amount, payParams) {
  authXML = paymentAdapter.authToXML(userPin, deviceId, deviceSer, payParams);

  try {
    const client = await socketClient(host, port, ttl);
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
    let infoXML = paymentAdapter.subscriberInfoToXML(accountNo, authResp.SessionId, payParams, amount);
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Subscriber Req: ${infoXML}`, {});
    const subscriberResp = await client.request(infoXML)
      .then((serverResponse) => {
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Subscriber Res: ${serverResponse}`, {});
        return paymentAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        client.end();
        return aeonErrorObject;
      });

    if (subscriberResp.error) {
      client.end();
      return subscriberResp;
    }

    let payXML = paymentAdapter.paymentToXML(accountNo, amount, authResp.SessionId, payParams);
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API payXML Req: ${payXML}`, {});
    return await client.request(payXML)
      .then((serverResponse) => {
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API payXML Res: ${serverResponse}`, {});
        client.end();
        return paymentAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        client.end();
        return aeonErrorObject;
      });


  } catch (error) {
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Socket Client Error`, { error });
    return error;
  }
}

async function doGetSubscriberInfo(accountNo, payParams) {
  authXML = paymentAdapter.authToXML(userPin, deviceId, deviceSer, payParams);

  try {
    const client = await socketClient(host, port, ttl);
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
    let infoXML = paymentAdapter.subscriberInfoToXML(accountNo, authResp.SessionId, payParams);
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