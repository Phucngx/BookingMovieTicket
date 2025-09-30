const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3307, 
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root", 
  database: process.env.DB_NAME || "db_payment_service", 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL connected successfully!");
    connection.release();
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
  }
}

// Gọi test khi khởi động app
testConnection();

module.exports = pool;
