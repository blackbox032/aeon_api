var utils = require("./adapterUtils");

function toXML({ userPin, deviceId, deviceSer }, aeonParams, bankResp = {}) {
  ret =
    `<request>` +
    `<EventType>GetTopup</EventType>` +
    `<event>` +
    `<UserPin>${userPin}</UserPin>` +
    `<DeviceId>${deviceId}</DeviceId>` +
    `<DeviceSer>${deviceSer}</DeviceSer>` +
    `<TransType>${aeonParams.transType}</TransType>` +
    `<Reference>${aeonParams.reference}</Reference>` +
    `<PhoneNumber>${aeonParams.toAccount}</PhoneNumber>` +
    `<LoyaltyProfileId>${aeonParams.loyaltyProfileID}</LoyaltyProfileId>` +
    `<Amount>${aeonParams.amount}</Amount>` +
    `<tenderType>creditCard</tenderType>` +
    `<Recon transReference="${aeonParams.transReference}" accountNumber="${aeonParams.fromAccount}" sysReference="${aeonParams.toAccount} transNumber=${bankResp.auth_id_res}" authoriser=${bankResp.rrn} transDateTime=${bankResp.trx_datetime.replace(/[T,Z]/g, ' ')} ></Recon>` +
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