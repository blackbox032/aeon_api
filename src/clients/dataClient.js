const debug = require("../utils/debug");
const socketClient = require("./sockets/socketClient");
const bundleTopUpAdapter = require("../adapters/bundleTopUpAdapter");
const productListAdapter = require("../adapters/productListAdapter");
const mnoDataBundleValidationAdapter = require("../adapters/mnoDataBundleValidator");

const port = process.env.AEON_AIRTIME_PORT || 7800;
const host = process.env.AEON_AIRTIME_URL || "aeon.qa.bltelecoms.net";
const ttl = process.env.TTL || 60000;
const userPin = process.env.AEON_AIRTIME_PIN || "016351";
const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "865181";
const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "w!22!t";

async function getBundleList(transType) {
  xml = productListAdapter.toXML(userPin, deviceId, deviceSer, transType);
  try {
    const client = await socketClient(host, port, ttl);
    return await client
      .request(xml)
      .then((serverResponse) => {
        debug("Get DataBundles response: ", serverResponse);
        client.end();
        return productListAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        client.end();
        return aeonErrorObject;
      });
  } catch (error) {
    return error;
  }
}

async function doBundleValidation(transType, reference, phoneNumber, product) {
  xml = mnoDataBundleValidationAdapter.toXML(
    userPin,
    deviceId,
    deviceSer,
    transType,
    reference,
    phoneNumber,
    product
  );
  try {
    const client = await socketClient(host, port, ttl);
    return await client
      .request(xml)
      .then((serverResponse) => {
        debug("DataBundle Validation response: ", serverResponse);
        client.end();
        return mnoDataBundleValidationAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        client.end();
        return aeonErrorObject;
      });
  } catch (error) {
    return error;
  }
}

async function doBundleTopUp(transType, reference, phoneNumber, productCode) {
  xml = bundleTopUpAdapter.toXML(
    userPin,
    deviceId,
    deviceSer,
    transType,
    reference,
    phoneNumber,
    productCode
  );
  console.log(xml);
  try {
    const client = await socketClient(host, port, ttl);
    return await client
      .request(xml)
      .then((serverResponse) => {
        debug("DataBundle Topup response: ", serverResponse);
        client.end();
        return bundleTopUpAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        client.end();
        return aeonErrorObject;
      });
  } catch (error) {
    return error;
  }
}

module.exports = { doBundleTopUp, doBundleValidation, getBundleList };
