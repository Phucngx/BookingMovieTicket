const express = require("express");
const router = express.Router();
const controller = require("../controllers/payment_controller");

router.post("/create-order", controller.createOrder);
router.post("/callback", controller.callback);

module.exports = router;
