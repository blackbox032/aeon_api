const socketRequest = require("../src/clients/socketRequest");

//Test socketRequest().then syntax
socketRequest("127.0.0.1", 8090, "1", 60000).then(serverResponse => {
  console.log("1: ", serverResponse);
});

testAwait();

//test await socketRequest() syntax in an async function
async function testAwait() {
  console.log("2: ", await socketRequest("127.0.0.1", 8090, "2", 60000));
  console.log("3: ", await socketRequest("127.0.0.1", 8090, "3", 60000));
  console.log("4: ", await socketRequest("127.0.0.1", 8090, "4", 60000));
}
