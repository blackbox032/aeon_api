const db_api = require('../../db//db_api');

const socketTypes = {
  TCP: "TCP",
  TLS: "TLS",
};

const socketType = process.env.AEON_SOCKET_TYPE || socketTypes.TCP;

const client =
  socketType == socketTypes.TCP ?
  require("./socketTCP") :
  require("./socketTLS");

async function socketClient(aeonAuth, fromAccount) {
  const client = await client(aeonAuth.host, aeonAuth.port, aeonAuth.timeout);
  const id = fromAccount + get_time().replace(/[:]/g, '');
  db_api.log_socket(id, aeonAuth, client);
  return {...client, socket_id: id };
}

module.exports = socketClient;