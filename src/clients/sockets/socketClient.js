const socketTypes = {
  TCP: "TCP",
  TLS: "TLS",
};

const socketType = process.env.AEON_SOCKET_TYPE || socketTypes.TCP;

const client =
  socketType == socketTypes.TCP
    ? require("./socketTCP")
    : require("./socketTLS");

async function socketClient(host, port, ttl) {
  return client(host, port, ttl);
}

module.exports = socketClient;
