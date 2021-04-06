const client = require("../src/clients/electricityClient");

callingCode();

async function callingCode() {
  ret = await test();
  console.log(ret);
}

async function test() {
  return await client
    .doMeterTopUp(
      "07117341763", '10',
      "27721289793 07117341763",
      "ABGGJ3ISiXk_Ago - sCoNzSWMpZMj", false, { loyaltyProfileID: 123123132 }
    )
    .then((response) => {
      console.log("RETURNED: ", response);
      return response;
    })
    .catch((error) => {
      console.log("CAUGHT: ", error);
    });
}
