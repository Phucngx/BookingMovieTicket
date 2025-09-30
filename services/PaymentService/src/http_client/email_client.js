const axios = require("axios");

const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL;
console.log("EMAIL_SERVICE_URL: ", EMAIL_SERVICE_URL);


async function sendEmailBooking({ account, bookingDetailInfo, payment }) {
  const payload = { account, bookingDetailInfo, payment };

  const { data } = await axios.post(`${EMAIL_SERVICE_URL}/emails/send-email`, payload);
  return data;
}

module.exports = { sendEmailBooking };
