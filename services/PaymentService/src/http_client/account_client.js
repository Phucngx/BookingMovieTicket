const axios = require("axios");

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

async function getAccount(accountId) {
  const response = await axios.get(
    `${USER_SERVICE_URL}/accounts/get-detail/${accountId}`
  );
  return response.data.data; 
}

module.exports = { getAccount };
