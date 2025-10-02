const emailService = require("../services/email_service");

async function sendEmailBooking(req, res) {
  try {
    const { account, bookingDetailInfo, payment } = req.body;
    console.log(`Send email to ${account?.user?.email}`);
    const result = await emailService.sendEmailBooking(account, bookingDetailInfo, payment);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { sendEmailBooking };