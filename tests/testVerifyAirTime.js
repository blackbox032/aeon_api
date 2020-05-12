const client = require("../src/clients/airtimeClient");

callingCode();

async function callingCode() {
  ret = await test();
}

async function test() {
  return await client
    .doAirtimeValidation("Vodacom", "3576125376", "27608815604", "10.00")
    .then((response) => {
      console.log("RETURNED: ", response);
      return response;
    })
    .catch((error) => {
      console.log("CAUGHT: ", error);
    });
}
