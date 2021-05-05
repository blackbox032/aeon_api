const logger = require("../utils/logger");
const socketClient = require("../clients/sockets/socketClient");
const paymentAdapter = require("../adapters/paymentAdapter");

async function doPayment(aeonParams) {
  const { accountNo, amount, subscriberEventType, aeonAuth } = aeonParams;
  authXML = paymentAdapter.authToXML(aeonAuth.userPin, aeonAuth.deviceId, aeonAuth.deviceSer, subscriberEventType);

  try {
    const client = await socketClient(aeonAuth.host, aeonAuth.port, aeonAuth.ttl);
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Auth Req: ${authXML}`, aeonAuth);
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
        return aeonErrorObject;
      });


  } catch (error) {
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API Socket Client Error`, { error });
    return error;
  }
}

async function doGetSubscriberInfo(aeonParams) {
  authXML = paymentAdapter.authToXML(userPin, deviceId, deviceSer, aeonParams.subscriberEventType);

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
    let infoXML = paymentAdapter.subscriberInfoToXML(aeonParams.accountNo, authResp.SessionId, aeonParams);
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