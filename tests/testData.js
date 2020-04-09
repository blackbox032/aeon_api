const client = require("../src/clients/dataClient");

test();
async function test() {
  obj = await client.getBundleList("MTNBundles");
  console.log(JSON.stringify(obj));
}
