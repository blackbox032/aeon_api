const client = require("../src/clients/electricityClient");

callingCode();

async function callingCode() {
  ret = await test();
  console.log(ret);
}

async function test() {
  return await client
    .doMeterTopUp("01050020003", "10000")
    .then((response) => {
      console.log("RETURNED: ", response);
      return response;
    })
    .catch((error) => {
      console.log("CAUGHT: ", error);
    });
}
