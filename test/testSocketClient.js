//Using the requestHandler

//Because of the way Node caching works,
//requestHandler a singleton. Every module
//that imports requestHandler like this
//gets the same requestHandler object with
//the same state
const socketRequest = require("../src/clients/socketRequest");

socketRequest("127.0.0.1", 8090, "1", 60000, function(serverResponse) {
  console.log("1: ", serverResponse);
  //process the server response string
});

socketRequest("127.0.0.1", 8090, "2", 60000, function(serverResponse) {
  console.log("2: ", serverResponse);
  //process the server response string
});

socketRequest("127.0.0.1", 8090, "3", 60000, function(serverResponse) {
  console.log("3: ", serverResponse);
  //process the server response string
});

socketRequest("127.0.0.1", 8090, "4", 60000, function(serverResponse) {
  console.log("4: ", serverResponse);
  //process the server response string
});
