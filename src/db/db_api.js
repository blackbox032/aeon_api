const mysql = require("mysql");
const child_process = require('child_process');

const utils = require('../helpers/utils');
const ENV = require('../constants/env_consts');
const infobip_api = require("./infobip_api");
const sms_api = require('./sms_api');
const DB = require('../constants/db_conts');

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

const MYSQL_LOG_SOCKET = `INSERT INTO log_aeon_api SET ?;`
const MYSQL_LOG_REQ_RES = `INSERT INTO log_aeon_api SET ?;`

// ------------------------------------------------------------------------------------------------------------------------------

module.exports.log_socket = (id, aeonAuth) => {
  const socketParams = {
    id,
    host_ip: aeonAuth.host,
    port: aeonAuth.port,
    user_pin: aeonAuth.userPin,
    device_id: aeonAuth.deviceId,
    device_ser: aeonAuth.deviceSer,
    // connection_result: 
  };

  connection.query(MYSQL_CREATE_SOCKET, socketParams, async function(error) {
    if (error) {
      console.log(error)
    };
  });
}

// ------------------------------------------------------------------------------------------------------------------------------

module.exports.log_req_res = (socket_id, req_id, req_at, res_time_ms, req_json, res_json, req_xml) => {
  const apiParams = {
    socket_id,
    req_id,
    msisdn: req_json.fromAccount,
    req_json,
    req_xml,
    req_at,
    res_json,
    res_xml,
    res_time_ms,

  };

  connection.query(MYSQL_LOG_REQ_RES, apiParams, async function(error) {
    if (error) {
      console.log(error)
    };
  })

}

// ------------------------------------------------------------------------------------------------------------------------------