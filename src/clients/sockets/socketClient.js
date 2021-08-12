const db_api = require('../../db/db_api');
const dt = require('../../utils/date_time');

const socketTypes = {
  TCP: "TCP",
  TLS: "TLS",
};

const socketType = process.env.AEON_SOCKET_TYPE || socketTypes.TCP;

const client = socketType == socketTypes.TCP ? require("./socketTCP") : require("./socketTLS");

async function socketClient(aeonAuth, { fromAccount }) {
  const clientData = await client(aeonAuth.host, aeonAuth.port, aeonAuth.timeout);
  const id = dt.get_date_str().replace(/[:/ ]/g, '').slice(-10) + fromAccount.slice(-5);
  db_api.log_socket(id, aeonAuth, clientData);
  return {...clientData, socket_id: id };
};

module.exports = socketClient;