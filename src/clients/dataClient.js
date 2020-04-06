const socketRequest = require("./socketRequest");
const bundleTopUpAdapter = require("../adapters/bundleTopUpAdapter");
const productListAdapter = require("../adapters/productListAdapter");

const port = process.env.AEON_AIRTIME_PORT || 7800;
const host = process.env.AEON_AIRTIME_URL || "aeon.qa.bltelecoms.net";
const ttl = process.env.TTL || 60000;
const userPin = process.env.AEON_AIRTIME_PIN || "016351";
const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "865181";
const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "w!22!t";

async function getBundleList(transType) {
  xml = productListAdapter.toXML(userPin, deviceId, deviceSer, transType);
  return await socketRequest(host, port, xml, ttl).then((serverResponse) => {
    // console.log("Bundle List response: ", serverResponse);
    return productListAdapter.toJS(serverResponse);
  });
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
  return await socketRequest(host, port, xml, ttl).then((serverResponse) => {
    console.log("DataBundle Validation response: ", serverResponse);
    return mnoDataBundleValidationAdapter.toJS(serverResponse);
  });
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
  return await socketRequest(host, port, xml, ttl).then((serverResponse) => {
    // console.log("Bundle Topup response: ", serverResponse);
    return bundleTopUpAdapter.toJS(serverResponse);
  });
}

module.exports = { doBundleTopUp, doBundleValidation, getBundleList };
