const client = require("../src/clients/airtimeClient");

callingCode();

async function callingCode() {
  ret = await test();
  console.log(ret);
}

async function test() {
  return await client
    .doAirtimeValidation("Vodacom", "3576125376", "0608815604", "5.00")
    .then((response) => {
      console.log("RETURNED: ", response);
      return response;
    })
    .catch((error) => {
      console.log("CAUGHT: ", error);
    });
}
