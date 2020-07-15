const socketClient = require("../src/clients/socketClient");

//socketClient is a factory function
//it produces a new client each time you call it
const client1 = socketClient("127.0.0.1", 8090, 60000);
client1
  .request("1")
  .then((serverResponse) => {
    console.log("1: ", serverResponse);
    client1
      .request("2")
      .then((serverResponse) => {
        console.log("2: ", serverResponse);
        client1.end();
      })
      .catch((ex) => {
        console.log("client1 error: ", ex);
      });
  })
  .catch((ex) => {
    console.log("client1 error: ", ex);
  });
