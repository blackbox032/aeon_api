const client = require("../src/clients/reprintClient");

callingCode();

async function callingCode() {
  ret = await test();
  console.log(ret);

}

async function test() {
  return await client.reprint()
    .then((response) => {
      console.log("RETURNED: ", response);
      return response;
    })
    .catch((error) => {
      console.log("CAUGHT: ", error);
    });
}