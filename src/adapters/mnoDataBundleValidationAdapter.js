var utils = require("./adapterUtils");

function toXML(
  userPin,
  deviceId,
  deviceSer,
  transType,
  reference,
  phoneNumber,
  productCode,
  amount,
  payParams
) {
  ret =
    `<request>` +
    `<EventType>MNOValidation</EventType>` +
    `<event>` +
    `<UserPin>${userPin}</UserPin>` +
    `<DeviceId>${deviceId}</DeviceId>` +
    `<DeviceSer>${deviceSer}</DeviceSer>` +
    `<TransType>${transType}</TransType>` +
    `<Reference>${reference}</Reference>` +
    `<PhoneNumber>${phoneNumber}</PhoneNumber>` +
    `<Amount>${amount}</Amount>` +
    `<ProductCode>${productCode}</ProductCode>` +
    // `<Recon transReference="${transReference}" accountNumber="${payParams.fromAccount}" sysReference="${payParams.toAccount}"></Recon>` +
    `</event>` +
    `</request>`;
  return ret + "\n";
}

//may return success response
//or standard error object
function toJS(xml) {
  return utils.getObj(xml);
}

module.exports = {
  toXML,
  toJS
};