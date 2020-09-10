var utils = require("./adapterUtils");

function toXML(
  userPin,
  deviceId,
  deviceSer,
  transType,
  reference,
  phoneNumber,
  amount,
  transReference,
  payParams
) {
  ret =
    `<request>` +
    `<EventType>GetTopup</EventType>` +
    `<event>` +
    `<UserPin>${userPin}</UserPin>` +
    `<DeviceId>${deviceId}</DeviceId>` +
    `<DeviceSer>${deviceSer}</DeviceSer>` +
    `<TransType>${transType}</TransType>` +
    `<Reference>${reference}</Reference>` +
    `<PhoneNumber>${phoneNumber}</PhoneNumber>` +
    `<LoyaltyProfileId>${payParams.loyaltyProfileID}</LoyaltyProfileId>` +
    `<Amount>${amount}</Amount>` +
    `<tenderType>creditCard</tenderType>` +
    `<Recon transReference="${transReference}" accountNumber="${payParams.fromAccount}" sysReference="${payParams.toAccount}"></Recon>` +
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
  toJS,
};