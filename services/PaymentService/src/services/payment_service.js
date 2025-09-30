const Payment = require("../models/payment_model");
const zaloPay = require("./providers/zalopay_provider");
const accountClient = require("../http_client/account_client");
const bookingClient = require("../http_client/booking_client");
const emailClient = require("../http_client/email_client");

async function createPaymentOrder({ 
    bookingId, 
    amount, 
    accountId,
    provider 
}) {
  if (provider === "ZALOPAY") {
    const account = await accountClient.getAccount(accountId);
    
    const order = await zaloPay.createOrder({ bookingId, amount, account });
    console.log("order: ", order);
    const paymentId = await Payment.createPayment({
      bookingId,
      provider,
      amount,
      qrUrl: order.order_url,
      appTransId: order.app_trans_id 
    });
    console.log("qrUrl:  ", order.order_url);
    
    return {
      paymentId,
      qrUrl: order.order_url,
    };
  }
  throw new Error("Provider not supported");
}
async function handleCallback(data) {
  if (zaloPay.verifyCallback(data)) {
    const payload = JSON.parse(data.data);
    console.log("payload: ", payload);
    
    const appTransId = payload.app_trans_id;
    const payment = await Payment.findByAppTransId(appTransId);
    if (!payment) {
      console.error("Payment not found for appTransId:", appTransId);
      return;
    }
    console.log("payment: ", payment);
    
    const queryResult = await zaloPay.queryOrder(appTransId);
    console.log("Query result:", queryResult);

    let status = "PENDING";
    if (queryResult.return_code === 1 && queryResult.sub_return_code === 1) {
      status = "SUCCESS";
    } else if (queryResult.sub_return_code === 3) {
      status = "FAILED";
    } else if (queryResult.sub_return_code === 4) {
      status = "CANCELLED";
    } else if (queryResult.sub_return_code === 5) {
      status = "EXPIRED";
    }

    console.log("status: ", status);
    console.log("appTransId: ", appTransId);
    console.log("queryResult.zp_trans_id: ", queryResult.zp_trans_id);
    
    // Update DB
    await Payment.updatePaymentStatus(payment.payment_id, status, queryResult.zp_trans_id);

    // Notify Booking Service
    const booking = await bookingClient.confirmPayment({
      paymentId: payment.payment_id,
      status,
    });
    console.log("booking: ", booking);

    if(booking?.data?.status === "CONFIRMED"){
      const { accountId, bookingId } = booking.data;
      const account = await accountClient.getAccount(accountId);
      console.log("account: ", account);
      const bookingDetailInfo = await bookingClient.getBookingDetailInfo(bookingId);
      console.log("bookingDetailInfo: ", bookingDetailInfo);

      try {
        const resp = await emailClient.sendEmailBooking({
          account,
          bookingDetailInfo,
          payment,
        });
        console.log("EmailService response:", resp);
        console.log("EmailService: sent BOOKING_SUCCESS email");
      } catch (e) {
        console.error("Call EmailService failed:",
          e?.response?.status,
          e?.response?.data || e.message
        );
      }
    } else {
      console.log("Get booking failed");
    }
  }
}


module.exports = { createPaymentOrder, handleCallback };
