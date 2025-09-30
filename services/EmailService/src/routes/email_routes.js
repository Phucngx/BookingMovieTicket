const express = require("express");
const router = express.Router();
const controller = require("../controllers/email_controller");

router.post("/send-email", controller.sendEmailBooking);

module.exports = router;
