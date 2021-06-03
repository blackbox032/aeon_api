const socketClient = require("../src/clients/socketClient");

//socketClient is a factory function
//it produces a new client each time you call it
const client1 = socketClient("127.0.0.1", 8090, 60000);
client1
  .request("1")
  .then((resXML) => {
    console.log("1: ", resXML);
    client1
      .request("2")
      .then((resXML) => {
        console.log("2: ", resXML);
        client1.end();
      })
      .catch((ex) => {
        console.log("client1 error: ", ex);
      });
  })
  .catch((ex) => {
    console.log("client1 error: ", ex);
  });