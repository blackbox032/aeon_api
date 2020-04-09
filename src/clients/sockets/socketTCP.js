const debug = require("../../utils/debug");
const net = require("net");
const adapterUtils = require("../../adapters/adapterUtils");
//const errorAdapter = require("../adapters/errorAdapter");

socketClient = function (address, port, timeout) {
  return new Promise((resolve, reject) => {
    const client = {
      address: address,
      port: port,
      timeOut: timeout,
      connected: false,
      awaitingResponse: false,
      data: "",
    };

    client.socket = new net.Socket();
    client.socket.setEncoding("utf8");
    client.socket.setTimeout(timeout);

    client.connect = async () => {
      if (client.connected) {
        return new Promise.resolve();
      } else {
        debug("CONNECTING");
        client.socket.connect(port, address);
        return new Promise((resolve, reject) => {
          client.resolveConnect = resolve;
          client.rejectConnect = reject;
        });
      }
    };

    client.request = async (xml) => {
      if (!client.connected) {
        try {
          await client.connect();
        } catch (error) {
          return Promise.reject(error);
        }
      }

      debug("REQUESTING");
      client.data = "";
      client.awaitingResponse = true;
      client.socket.write(xml);
      return new Promise((resolve, reject) => {
        client.resolveRequest = resolve;
        client.rejectRequest = reject;
      });
    };

    client.end = async () => {
      try {
        client.socket.destroy();
      } catch {}
    };

    client.socket.on("connect", () => {
      client.connected = true;
      debug("CONNECTED: ");
      client.resolveConnect();
    });

    client.socket.on("error", (error) => {
      debug("SOCKET ERROR: ", error);
      if (!client.connected) {
        client.rejectConnect(
          adapterUtils.aeonError(
            "SocketConnectionError",
            error.message,
            "Communication error"
          )
          //errorAdapter.toXML("SocketConnectionError", JSON.stringify(error))
        );
      }

      if (client.awaitingResponse) {
        client.connected = false;
        client.rejectRequest(
          adapterUtils.aeonError(
            "SocketRequestError",
            error.message,
            "Communication error"
          )
          //errorAdapter.toXML("SocketRequestError", JSON.stringify(error))
        );
      }
    });

    client.socket.on("timeout", () => {
      debug("SOCKET TIMEOUT");
      if (!client.connected) {
        client.rejectConnect(
          adapterUtils.aeonError(
            "SocketTimeoutError",
            "Socket timed out",
            "Communication error"
          )
        );
      }

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
      }
    });

    client.socket.on("data", (chunk) => {
      debug("RECEIVING DATA");
      if (client.awaitingResponse) {
        client.data += chunk.toString();
        if (chunk.endsWith("\n")) {
          client.awaitingResponse = false;
          client.resolveRequest(client.data);
        }
      }
    });

    resolve(client);
  });
};

module.exports = socketClient;
