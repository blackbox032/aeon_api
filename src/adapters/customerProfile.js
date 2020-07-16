const axios = require('axios');

const LOYALTY_URL = process.env.LOYALTY_URL || 'https://api.qa.bltelecoms.net';
const LOYALTY_USERNAME = process.env.LOYALTY_USERNAME || 'sterring';
const LOYALTY_PASSWORD = process.env.LOYALTY_PASSWORD || 'gsetd557vntossiojrs4otq52r';
const userPin = process.env.AEON_AIRTIME_PIN || "016351";
const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "865181";
const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "w!22!t";


// --------------------------------------------------------------------------------------------------------------

const createProfile = async msisdn => {
  const endpoint = '/consumer/loyalty/v1/profile';

  // msisdn = '27721122332';

  const Reqdata = {
    deviceId,
    name: "Sterring" + msisdn,
    surname: "Sterring" + msisdn,
    mobile: msisdn,
    loyaltyCard: msisdn,
    deviceUserId: deviceId,
  }

  const config = {
    method: 'post',
    url: LOYALTY_URL + endpoint,
    auth: {
      username: LOYALTY_USERNAME,
      password: LOYALTY_PASSWORD
    },
    data: Reqdata
  }
  return await axios(config)
    .then(({ data }) => {
      if (data && data.profileId) {
        return {...Reqdata, ...data }
      }
      return data;
    })
    .catch(err => console.log(err))
}

// --------------------------------------------------------------------------------------------------------------

getProfileByMSISDN = async msisdn => {
  const endpoint = '/consumer/loyalty/v1/profile/complete/filterbymobilenumber?mobilenumber=';

  const config = {
    method: 'get',
    // url: LOYALTY_URL + endpoint + msisdn,
    url: LOYALTY_URL + endpoint + '0726159343',
    auth: {
      username: LOYALTY_USERNAME,
      password: LOYALTY_PASSWORD
    }
  }
  return await axios(config)
    .then(res => res.data)
    .catch(err => err.response.status)

};

// --------------------------------------------------------------------------------------------------------------

module.exports = {
  getProfileByMSISDN,
  createProfile
}