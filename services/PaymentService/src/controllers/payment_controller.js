const paymentService = require("../services/payment_service");

async function createOrder(req, res) {
  try {
    const { bookingId, amount, accountId, provider } = req.body;
    const result = await paymentService.createPaymentOrder({ bookingId, amount, accountId, provider });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function callback(req, res) {
  try {
    console.log("ZaloPay callback body:", req.body);
    await paymentService.handleCallback(req.body);
    res.json({ return_code: 1, return_message: "success" });
  } catch (err) {
    res.json({ return_code: 0, return_message: err.message });
  }
}

module.exports = { createOrder, callback };
