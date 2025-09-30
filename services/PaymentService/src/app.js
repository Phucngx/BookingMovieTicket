const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const paymentRoutes = require("./routes/payment_routes");
app.use("/payment-service/payments", paymentRoutes);

const PORT = process.env.PORT || 8086;

const { startPaymentCleanupJob } = require("./jobs/paymentCleanupJob");
startPaymentCleanupJob();

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
