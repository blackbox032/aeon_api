const net = require("net");
const errorAdapter = require("../adapters/errorAdapter");

function request(address, port, xml, timeout, onComplete) {
  const client = {
    init: function() {
      const client = this; //Needed because 'this' reference changes scope inside event callbacks
      client.data = "";
      client.onComplete = onComplete;
      client.socket = new net.Socket();
      client.socket.setEncoding("utf8");
      client.socket.setTimeout(timeout);
      client.socket.on("data", function(chunk) {
        client.data += chunk.toString();
        if (chunk.endsWith("\n")) {
          client.onComplete(client.data);
          client.socket.destroy();
        }
      });
      client.socket.on("error", function(error) {
        try {
          client.onComplete(
            errorAdapter.toXML("SocketError", JSON.stringify(error))
          );
          client.socket.destroy();
        } catch (error2) {
          console.log("Unhandled Error: ", JSON.stringify(error));
          console.log("Handling Error: ", JSON.stringify(error2));
        }
      });
      client.socket.on("timeout", function() {
        client.onComplete(
          errorAdapter.toXML("SocketTimeout", "The socket connection timed out")
        );
      });
      client.socket.connect(port, address, function() {
        console.log(xml);
        client.socket.write(xml);
      });
    }
  };
  client.init();
}

module.exports = request;
