var utils = require("./adapterUtils");

function toXML(
  userPin,
  deviceId,
  deviceSer,
  transType,
  reference,
  phoneNumber,
  productCode,
  transReference
) {
  ret =
    `<request>` +
    `<EventType>DoBundleTopup</EventType>` +
    `<event>` +
    `<UserPin>${userPin}</UserPin>` +
    `<DeviceId>${deviceId}</DeviceId>` +
    `<DeviceSer>${deviceSer}</DeviceSer>` +
    `<TransType>${transType}</TransType>` +
    `<Reference>${reference}</Reference>` +
    `<PhoneNumber>${phoneNumber}</PhoneNumber>` +
    `<ProductCode>${productCode}</ProductCode>` +
    `<Recon transReference="${transReference}"></Recon>` +
    `</event>` +
    `</request>`;
  return ret + "\n";
}

//may return success response
//or standard error object
function toJS(xml) {
  obj = utils.getObj(xml);
  delete obj.PrintLines;
  delete obj.MerchantPrintLines;
  return obj;
}

module.exports = {
  toXML,
  toJS,
};
