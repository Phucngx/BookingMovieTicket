const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmailBooking = async (account, bookingDetailInfo, payment) => {
  console.log("account", account);
  console.log("bookingDetailInfo", bookingDetailInfo);
  console.log("payment", payment);
  
  const toEmail = account?.user?.email;
  const customerName = account?.user?.fullName || "Quý khách";
  if (!toEmail) {
    console.error("sendEmailBooking: thiếu email người nhận");
    return;
  }

  // Helpers
  const toDate = (v) => {
    try { const d = new Date(v); return isNaN(d.getTime()) ? null : d; } catch { return null; }
  };
  const fmtDate = (v) => {
    const d = toDate(v);
    if (!d) return "—";
    return new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
  };
  const fmtTime = (v) => {
    const d = toDate(v);
    if (!d) return "—";
    return new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
  };
  const fmtVND = (n) => {
    if (n == null || isNaN(Number(n))) return "—";
    return Number(n).toLocaleString("vi-VN") + "₫";
  };

  // Map dữ liệu theo response thực tế bạn gửi
  const bookingId   = bookingDetailInfo?.bookingId;
  const movieTitle  = bookingDetailInfo?.movieName;
  const theaterName = bookingDetailInfo?.theaterName;
  const roomName    = bookingDetailInfo?.roomName;
  const seats       = Array.isArray(bookingDetailInfo?.seatNames) ? bookingDetailInfo.seatNames : [];
  const foods       = Array.isArray(bookingDetailInfo?.foodNames) ? bookingDetailInfo.foodNames : [];
  const startTime   = bookingDetailInfo?.startTime;
  const endTime     = bookingDetailInfo?.endTime;

  const provider    = payment?.provider;                  
  const payStatus   = payment?.status;                   
  const amount      = payment?.amount;                    

  // Nội dung email (HTML)
  const emailContent = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.5;">
      <h2 style="margin:0 0 8px;">Xác nhận đặt vé xem phim - CINEMA GO</h2>
      <p style="margin:0 0 12px;">Xin chào <b>${customerName}</b>, cảm ơn bạn đã đặt vé tại hệ thống của chúng tôi.</p>

      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:12px 0;">
        <p style="margin:0 0 6px;"><b>Mã đặt chỗ:</b> #${bookingId}</p>
        <p style="margin:0 0 6px;"><b>Phim:</b> ${movieTitle}</p>
        <p style="margin:0 0 6px;"><b>Rạp:</b> ${theaterName}</p>
        <p style="margin:0 0 6px;"><b>Phòng chiếu:</b> ${roomName}</p>
        <p style="margin:0 0 6px;"><b>Ghế:</b> ${seats.length ? seats.join(", ") : "—"}</p>
        ${foods.length ? `<p style="margin:0 0 6px;"><b>Combo/Đồ ăn:</b> ${foods.join(", ")}</p>` : ""}
        <p style="margin:0 0 6px;"><b>Suất chiếu:</b> ${fmtDate(startTime)} • ${fmtTime(startTime)} - ${fmtTime(endTime)}</p>
        <p style="margin:0 0 6px;"><b>Tổng tiền:</b> ${fmtVND(amount)}</p>
        <p style="margin:0 0 6px;"><b>Thanh toán:</b> Ví ${provider} • <b>Đã thanh toán</b></p>
      </div>

      <p style="margin:0 0 6px;">Vui lòng có mặt trước giờ chiếu ít nhất 15 phút để thuận tiện soát vé.</p>
      <p style="margin:0 0 6px;">Vé đã mua không thể hoàn trả.</p>
      <p style="margin:0 0 12px;">Đây là email tự động, không phản hồi lại email này.</p>
      <p style="margin:0;"><b>Trân trọng,</b><br/>Đội ngũ CINEMA GO</p>
    </div>
  `;

  // Plain text fallback (cho client không hỗ trợ HTML)
  const emailText =
    `Xác nhận đặt vé - CINEMA GO
    Khách hàng: ${customerName}
    Mã đặt chỗ: #${bookingId}
    Phim: ${movieTitle}
    Rạp: ${theaterName}
    Phòng: ${roomName}
    Ghế: ${seats.join(", ") || "—"}
    Đồ ăn: ${foods.join(", ") || "—"}
    Suất chiếu: ${fmtDate(startTime)} • ${fmtTime(startTime)} - ${fmtTime(endTime)}
    Tổng tiền: ${fmtVND(amount)}
    Thanh toán: Ví ${provider} • Đã thanh toán`;

  // Transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: process.env.MAIL_ACCOUNT, pass: process.env.MAIL_PASSWORD },
  });

  try {
    const info = await transporter.sendMail({
      from: `CINEMA GO <${process.env.MAIL_ACCOUNT}>`,
      to: toEmail,
      subject: `Xác nhận đặt vé • ${movieTitle} • #${bookingId}`,
      text: emailText,
      html: emailContent,
    });
    console.log("Message sent:", info.messageId);
    return { ok: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error?.message || error);
    return { ok: false, error: error?.message || "Send email failed" };
  }
};

module.exports = { sendEmailBooking };
