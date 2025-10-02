const axios = require("axios");

const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL;

async function confirmPayment(data) {
  const res = await axios.post(`${BOOKING_SERVICE_URL}/bookings/payment-callback`, data);
  return res.data;                 
}

async function getBookingDetailInfo(bookingId) {
  const res = await axios.get(`${BOOKING_SERVICE_URL}/bookings/ticket/${bookingId}`);
  return res.data.data;                 
}


module.exports = { confirmPayment, getBookingDetailInfo };
