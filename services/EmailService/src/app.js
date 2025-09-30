const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const emailRoutes = require("./routes/email_routes");
app.use("/email-service/emails", emailRoutes);

const PORT = process.env.PORT || 8087;

app.listen(PORT, () => {
  console.log(`Email Service running on port ${PORT}`);
});
