const client = require("../src/clients/electricityClient");

callingCode();

async function callingCode() {
  ret = await test();
}

async function test() {
  return await client
    .doVerifyMeter("07063953108", "100.00")
    .then((response) => {
      console.log("RETURNED: ", response);
      return response;
    })
    .catch((error) => {
      console.log("CAUGHT: ", error);
    });
}
