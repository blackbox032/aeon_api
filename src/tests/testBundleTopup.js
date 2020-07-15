const client = require("../src/clients/dataClient");

doTopup();

async function doTopup() {
  xml = await client.doBundleTopUp("MTNBundles", "123456", "0830012345", "869");
  console.log(xml);
}
