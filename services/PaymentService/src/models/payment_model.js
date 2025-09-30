const pool = require("../config/db");

async function createPayment({ bookingId, provider, amount, qrUrl, appTransId }) {
  const [result] = await pool.query(
    `INSERT INTO payments (booking_id, provider, amount, status, qr_url, app_trans_id) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [bookingId, provider, amount, "PENDING", qrUrl, appTransId]
  );
  return result.insertId;
}

async function updatePaymentStatus(paymentId, status, transactionId = null) {

  console.log("param in query db:", {
  paymentId,
  status,
  transactionId
  });

  await pool.query(
    `UPDATE payments SET status=?, transaction_id=?, updated_at=NOW() WHERE payment_id=?`,
    [status, transactionId, paymentId]
  );
}

async function findById(paymentId) {
  const [rows] = await pool.query(
    `SELECT * FROM payments WHERE payment_id=?`,
    [paymentId]
  );
  return rows[0];
}

async function findByAppTransId(appTransId) {
  const [rows] = await pool.query(
    `SELECT * FROM payments WHERE app_trans_id=?`,
    [appTransId]
  );
  return rows[0];
}

module.exports = { createPayment, updatePaymentStatus, findById, findByAppTransId };
