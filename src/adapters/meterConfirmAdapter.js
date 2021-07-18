var utils = require("./adapterUtils");

function toXML({ userPin, deviceId, deviceSer }, aeonParams = {}, bankResp) {

  const recon = bankResp == undefined ? '' : `<Recon transReference="${bankResp.auth_id_res}" accountNumber="${aeonParams.fromAccount}" sysReference="${aeonParams.toAccount}" transNumber="${bankResp.user_id}" authoriser="${bankResp.rrn}" transDateTime="${bankResp.trx_datetime.replace(/[T,Z]/g, ' ')}"></Recon>`; 

  ret =
    `<request>` +
    `<Version>2.0</Version>` +
    `<EventType>ConfirmMeter</EventType>` +
    `<event>` +
    `<DeviceId>${deviceId}</DeviceId>` +
    `<DeviceSer>${deviceSer}</DeviceSer>` +
    `<UserPin>${userPin}</UserPin>` +
    `<MeterNum>${aeonParams.toAccount}</MeterNum>` +
    `<Amount>${aeonParams.amount || '100'}</Amount>` +
    `<LoyaltyProfileId>${aeonParams.loyaltyProfileID}</LoyaltyProfileId>` +
    `<tenderType>creditCard</tenderType>` +
    recon +
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