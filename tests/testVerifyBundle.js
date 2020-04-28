const client = require("../src/clients/dataClient");
const mnoDataBundleValidationAdapter = require("../src/adapters/mnoDataBundleValidationAdapter");
const port = process.env.AEON_AIRTIME_PORT || 7800;
const host = process.env.AEON_AIRTIME_URL || "aeon.qa.bltelecoms.net";
const ttl = process.env.TTL || 60000;
const userPin = process.env.AEON_AIRTIME_PIN || "016351";
const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "865181";
const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "w!22!t";

callingCode();

async function callingCode() {
  ret = await test();
}

async function test() {
  transType = "MTNBundles";
  reference = "3576125376";
  phoneNumber = "27832697257";
  product = "2321";
  console.log(
    mnoDataBundleValidationAdapter.toXML(
      userPin,
      deviceId,
      deviceSer,
      transType,
      reference,
      phoneNumber,
      product
    )
  );
  return await client
    .doBundleValidation(transType, reference, phoneNumber, product)
    .then((response) => {
      console.log("RETURNED: ", response);
      return response;
    })
    .catch((error) => {
      console.log("CAUGHT: ", error);
    });
}
