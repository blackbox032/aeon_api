const mysql = require("mysql");
const dt = require('../utils/date_time')


// ------------------------------------------------------------------------------------------------------------------------------

const connection = mysql.createConnection({
  host: process.env.STERRING_DB_HOST,
  user: process.env.STERRING_DB_USER,
  password: process.env.STERRING_DB_PASS,
  database: process.env.STERRING_DB_NAME || 'sterring',
  port: process.env.STERRING_DB_PORT || 3306,
  charset: 'utf8mb4',
});

// ------------------------------------------------------------------------------------------------------------------------------

const MYSQL_LOG_SOCKET = `INSERT INTO aeon_api_sockets SET ?;`;
const MYSQL_LOG_REQ_RES = `INSERT INTO aeon_api_req_res SET ?;`;
const MYSQL_LOG_SOCKET_TIME_MS = 'UPDATE aeon_api_sockets SET socket_time_ms = ? WHERE id = ?;'


// ------------------------------------------------------------------------------------------------------------------------------

module.exports.log_socket = (id, aeonAuth) => {
  const socketParams = {
    id,
    host_ip: aeonAuth.host,
    port: aeonAuth.port,
    user_pin: aeonAuth.userPin,
    device_id: aeonAuth.deviceId,
    device_ser: aeonAuth.deviceSer,
    app_name: aeonAuth.app_name,
    // connection_result: 
  };

  connection.query(MYSQL_LOG_SOCKET, socketParams, async function(error) {
    if (error) {
      console.log(error)
    };
  });
}

// ------------------------------------------------------------------------------------------------------------------------------

module.exports.log_socket_time_ms = (socket_id, time_ms) => {
  connection.query(MYSQL_LOG_SOCKET_TIME_MS, [time_ms, socket_id], async function(error) {
    if (error) {
      console.log(error)
    };
  });
};

// ------------------------------------------------------------------------------------------------------------------------------

module.exports.log_req_res = (socket_id, req_id, req_at, res_time_ms, req_json, res_json, req_xml, res_xml) => {

  const apiParams = {
    socket_id,
    req_id,
    req_json: JSON.stringify(req_json),
    req_xml,
    // req_at: dt.date_str(req_at, 'sv-SE'),
    req_at: new Date(req_at).toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    res_json: JSON.stringify(res_json),
    res_xml,
    res_time_ms
  };

  connection.query(MYSQL_LOG_REQ_RES, apiParams, async function(error) {
    if (error) {
      console.log(error)
    };
  })

}

// ------------------------------------------------------------------------------------------------------------------------------