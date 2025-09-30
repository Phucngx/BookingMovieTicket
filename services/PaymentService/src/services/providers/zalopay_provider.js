const crypto = require("crypto");
const axios = require("axios");
const qs = require("qs");
const dayjs = require("dayjs");
const { log } = require("console");

const config = {
  app_id: process.env.ZALO_APP_ID,
  key1: process.env.ZALO_KEY1,
  key2: process.env.ZALO_KEY2,
  endpoint: "https://sb-openapi.zalopay.vn/v2/create", 
  endpoint2: "https://sb-openapi.zalopay.vn/v2/query",
  tunnelLink: "https://polyphonic-fisheries-away-tip.trycloudflare.com"
};


async function createOrder({ bookingId, amount, account }) {
  const app_trans_id = dayjs().format("YYMMDD") + "_" + Date.now(); // mã giao dịch duy nhất

  const embed_data = {
    redirecturl: `http://localhost:3000/payment-result?bookingId=${bookingId}`,
    bookingId
  };

  const data = {
    app_id: config.app_id,
    app_trans_id,
    app_user: "movie_booking_user",
    app_time: Date.now(),
    item: JSON.stringify([{ bookingId, amount }]),
    embed_data: JSON.stringify( embed_data ),
    amount,
    description: `Tài khoản ${account.username} đặt vé xem phim qua Website, mã đặt vé - ${bookingId}`,
    bank_code: "zalopayapp",
    callback_url: `${config.tunnelLink}/payment-service/payments/callback`
  };
  console.log("data: ", data);
  
  // Tạo mac để ký
  const dataStr = `${config.app_id}|${data.app_trans_id}|${data.app_user}|${data.amount}|${data.app_time}|${data.embed_data}|${data.item}`;
  data.mac = crypto.createHmac("sha256", config.key1).update(dataStr).digest("hex");
  
  try {
    const res = await axios.post(config.endpoint, qs.stringify(data), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return { ...res.data, app_trans_id };
  } catch (err) {
    if (err.response) {
      console.error("ZaloPay error:", err.response.data);
    } else {
      console.error("Request failed:", err.message);
    }
    throw err;
  }
}

function verifyCallback(data) {
  const mac = crypto
    .createHmac("sha256", config.key2)
    .update(data.data)
    .digest("hex");
  return mac === data.mac;
}

async function queryOrder(appTransId) {
  const postData = {
    app_id: config.app_id,
    app_trans_id: appTransId,
  };

  const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
  postData.mac = crypto.createHmac("sha256", config.key1).update(data).digest("hex");

  try {
    const res = await axios.post(config.endpoint2,
      qs.stringify(postData),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return res.data; 
  } catch (err) {
    console.error("Query Order error:", err.response ? err.response.data : err.message);
    throw err;
  }
}


module.exports = { createOrder, verifyCallback, queryOrder };
