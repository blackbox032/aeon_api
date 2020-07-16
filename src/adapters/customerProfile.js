const axios = require('axios');

const LOYALTY_URL = process.env.LOYALTY_URL || 'https://api.qa.bltelecoms.net';
const LOYALTY_USERNAME = process.env.LOYALTY_USERNAME || 'sterring';
const LOYALTY_PASSWORD = process.env.LOYALTY_PASSWORD || 'gsetd557vntossiojrs4otq52r';

module.exports.getProfileByMSISDN = async msisdn => {
  const endpoint = '/consumer/loyalty/v1/profile/complete/filterbymobilenumber?mobilenumber=';

  const config = {
    method: 'get',
    url: LOYALTY_URL + endpoint + msisdn,
    auth: {
      username: LOYALTY_USERNAME,
      password: LOYALTY_PASSWORD
    }
  }
  return await axios(config)
    .then(res => res.data)
    .catch(err => err)

}