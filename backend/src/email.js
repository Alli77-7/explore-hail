// جديد — يرسل للمستخدم نتيجة قرار مقدم الخدمة عبر Resend عند ضبط مفاتيح البريد.
async function sendBookingStatusEmail({ to, customerName, businessName, status, bookingDate }) {
    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return false;
    const accepted = status === "confirmed";
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: process.env.EMAIL_FROM,
            to: [to],
            subject: accepted ? "Booking request accepted" : "Booking request declined",
            text: `Hello ${customerName}, your booking request with ${businessName} for ${bookingDate} was ${accepted ? "accepted" : "declined"}.`,
        }),
    });
    if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
    return true;
}

// جديد — يتيح للخادم إرسال رسالة نتيجة الحجز.
module.exports = { sendBookingStatusEmail };
