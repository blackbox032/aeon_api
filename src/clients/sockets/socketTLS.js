const debug = require("../../utils/debug");
const tls = require("tls");
const adapterUtils = require("../../adapters/adapterUtils");

socketClient = function (address, port, timeout) {
  return new Promise((resolve, reject) => {
    const client = {
      address: address,
      port: port,
      timeOut: timeout,
      connected: false,
      awaitingResponse: false,
      data: "",
      resolve: null,
      reject: null,
    };

    client.socket = new tls.connect(port, address);
    client.socket.setEncoding("utf8");
    client.socket.setTimeout(timeout);

    client.socket.on("secureConnect", () => {
      console.log("CONNECTED");
      client.connected = true;
      resolve(client);
    });

    client.socket.on("error", (error) => {
      debug("SOCKET ERROR: ", error);
      if (client.awaitingResponse) {
        client.connected = false;
        client.reject(
          adapterUtils.aeonError(
            "SocketRequestError",
            error.message,
            "Communication error"
          )
        );
      } else {
        reject(
          adapterUtils.aeonError(
            "SocketConnectError",
            error.message,
            "Communication error"
          )
        );
      }
    });

    client.socket.on("timeout", () => {
      debug("SOCKET TIMEOUT");
      if (client.awaitingResponse) {
        client.connected = false;
        client.awaitingResponse = false;
        client.rejectRequest(
          adapterUtils.aeonError(
            "SocketTimeoutError",
            "Socket timed out",
            "Communication error"
          )
        );
      } else {
        reject(
          adapterUtils.aeonError(
            "SocketTimeourError",
            error.message,
            "Communication error"
          )
        );
      }
    });

    client.socket.on("data", (chunk) => {
      debug("RECEIVING DATA");
      if (client.awaitingResponse) {
        client.data += chunk.toString();
        if (chunk.endsWith("\n")) {
          client.awaitingResponse = false;
          client.resolve(client.data);
        }
      }
    });

    client.request = async (xml) => {
      debug("REQUESTING");

      client.data = "";
      client.awaitingResponse = true;
      client.socket.write(xml);

      return new Promise((resolve, reject) => {
        client.resolve = resolve;
        client.reject = reject;
      });
    };

    client.end = async () => {
      try {
        client.socket.destroy();
      } catch {}
    };
  });
};

module.exports = socketClient;
