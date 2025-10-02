const cron = require("node-cron");
const pool = require("../config/db");

function startPaymentCleanupJob() {
  cron.schedule("* * * * *", async () => {
    try {
      const [rows] = await pool.query(
        `UPDATE payments 
         SET status='EXPIRED', updated_at=NOW() 
         WHERE status='PENDING' 
         AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) > 15`
      );
      if (rows.affectedRows > 0) {
        console.log(`Payment cleanup: ${rows.affectedRows} expired payments`);
      }
    } catch (err) {
      console.error("Payment cleanup job failed:", err.message);
    }
  });
}

module.exports = { startPaymentCleanupJob };
