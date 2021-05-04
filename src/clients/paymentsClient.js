const logger = require("../utils/logger");
const socketClient = require("../clients/sockets/socketClient");
const paymentAdapter = require("../adapters/paymentAdapter");
const reprintClient = require("../clients/reprintClient");

const port = process.env.AEON_AIRTIME_PORT || 7800;
const host = process.env.AEON_AIRTIME_URL || "aeon.qa.bltelecoms.net";
// const ttl = process.env.TTL_PAYMENT || 180000;
const ttl = process.env.TTL_PAYMENT || 600;
const userPin = process.env.AEON_AIRTIME_PIN || "016351";
const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "865181";
const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "w!22!t";

const RETRY_TEXT = [
  '',
  '',
  'Eish Hade, Sterring! Your bank took too long to approve. Mara don’t worry, you didn’t pay.',
  'Hola Sterring! Don’t go! We are waiting for your banks approval.Eish Hade, Sterring! Your bank took too long to approve. Mara don’t worry, you didn’t pay.\n\nHit *0* to try again or * to start over'
]
async function doPayment(accountNo, amount, payParams, retries = 3, isTimeoutRetry = false) {
  authXML = paymentAdapter.authToXML(userPin, deviceId, deviceSer, payParams);
  let isConfirmAPI = false;
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
        return {...aeonErrorObject, isConfirmAPI };
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

        if (!isTimeoutRetry && aeonErrorObject.AeonErrorText == 'Communication error') {

          reprintClient.reprint()


          // console.log('1. this logic works line 43', isTimeoutRetry)
          // return doPayment(accountNo, amount, payParams, retries - 1, true);
        }
        console.log('2. this logic works too line 46', isTimeoutRetry)
        return {...aeonErrorObject, isConfirmAPI };
        // return {...aeonErrorObject, isConfirmAPI };
      });

    if (subscriberResp.error) {
      client.end();
      return subscriberResp;
    }

    payParams.trxID = subscriberResp.TransRef;
    isConfirmAPI = true;
    let payXML = paymentAdapter.paymentToXML(accountNo, amount, authResp.SessionId, payParams);
    logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API payXML Req: ${payXML}`, {});
    return await client.request(payXML)
      .then((serverResponse) => {
        logger.log(logger.levels.TRACE, logger.sources.AEON_API, `Aeon API payXML Res: ${serverResponse}`, {});
        client.end();
        // return paymentAdapter.toJS(serverResponse);

        if (retries < 1) {
          return paymentAdapter.toJS(serverResponse);
        }
        switch (paymentAdapter.toJS(serverResponse).AeonErrorText) {
          case 'Technical Error':
          case "Supplier offline, please retry":
          case "Supplier Offline":
            const sterring_url = `http://sterring_proxy:12121/api/v1/send-message`;
            const payload = { text: RETRY_TEXT[retries], msisdn: payParams.fromAccount, method: "POST", url: `http://sterring_proxy:12121/api/v1/send-message` }
            axios.post(payload)
              .then(res => "console.log('sent to: ', sterring_url)")
              .catch(error => console.log('failed to send to ', sterring_url, ' by ', payload, 'error: ', error.message))

            return setTimeout(() => doPayment(accountNo, amount, payParams, retries - 1), 5000);
          default:
            return paymentAdapter.toJS(serverResponse);
        }

        // client.end();
        // return paymentAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        client.end();

        // if not timeoutRetry then reprint if successful the return else redo the payment

        if (!isTimeoutRetry && aeonErrorObject.AeonErrorText == 'Communication error') {
          await reprintClient.reprint()
            // authClient('Electricity')
            // .then(res => {
            //   console.log('Auth Client res', res)


          // })
          // .catch((aeonErrorObject) => console.log('aeonErrorObject', aeonErrorObject))

          // console.log('1. this logic works', isTimeoutRetry)
          // doPayment(accountNo, amount, payParams, retries - 1, true);
        }
        console.log('2. this logic works too', isTimeoutRetry)

        return {...aeonErrorObject, isConfirmAPI };
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