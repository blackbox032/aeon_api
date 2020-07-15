const socketClient = require("../src/clients/socketClient");
const port = process.env.AEON_AIRTIME_PORT || 443;
const host = process.env.AEON_AIRTIME_URL || "aeonssl.live.bltelecoms.net";
const ttl = process.env.TTL || 60000;

callingCode();

async function callingCode() {
  ret = await test();
  console.log(ret);
}

async function test() {
  xml =
    "<request><EventType>Authentication</EventType><event><UserPin>011234</UserPin><DeviceId>103936</DeviceId><DeviceSer>GniRR3t5639!</DeviceSer><TransType>Vodacom</TransType></event></request>\n";
  try {
    const client = await socketClient(host, port, ttl);
    return await client
      .request(xml)
      .then(async (serverResponse) => {
        return await client
          .request(xml)
          .then((serverResponse2) => {
            client.end();
            return serverResponse2;
          })
          .catch((aeonErrorObject) => {
            client.end();
            return aeonErrorObject;
          });
        client.end();
        return ret;
        //return airtimeTopUpAdapter.toJS(serverResponse);
      })
      .catch((aeonErrorObject) => {
        client.end();
        return aeonErrorObject;
      });
  } catch (error) {}
}
