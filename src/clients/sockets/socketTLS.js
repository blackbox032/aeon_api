const logger = require("../../utils/logger");
const debug = logger.debug;
const tls = require("tls");
const adapterUtils = require("../../adapters/adapterUtils");

socketClient = function(address, port, timeout) {
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
      debug("CONNECTED");
      client.connected = true;
      resolve(client);
    });

    client.socket.on("error", (error) => {
      if (client.awaitingResponse) {
        logger.log(
          logger.levels.TRACE,
          logger.sources.AEON_API,
          "Aeon API Socket Response Error",
          error
        );
        client.connected = false;
        client.reject(
          adapterUtils.aeonError(
            "SocketRequestError",
            error.message,
            "Communication error"
          )
        );
      } else {
        logger.log(
          logger.levels.TRACE,
          logger.sources.AEON_API,
          "Aeon API Socket Connection Error",
          error
        );
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
      if (client.awaitingResponse) {
        logger.log(
          logger.levels.TRACE,
          logger.sources.AEON_API,
          "Aeon API Socket Response Timeout",
          "error"
        );
        client.connected = false;
        client.awaitingResponse = false;
        client.reject(
          adapterUtils.aeonError(
            "SocketTimeoutError",
            "Socket timed out",
            "Communication error"
          )
        );
      } else {
        logger.log(
          logger.levels.TRACE,
          logger.sources.AEON_API,
          "Aeon API Socket Connection Timeout",
          "error"
        );
        reject(
          adapterUtils.aeonError(
            "SocketTimeoutError",
            "Aeon API Socket Timeout Waiting for response",
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

    client.request = async(xml) => {
      debug("REQUESTING");

      client.data = "";
      client.awaitingResponse = true;
      client.socket.write(xml);

      return new Promise((resolve, reject) => {
        client.resolve = resolve;
        client.reject = reject;
      });
    };

    client.end = async() => {
      try {
        client.socket.destroy();
      } catch {}
    };
  });
};

module.exports = socketClient;