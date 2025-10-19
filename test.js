import { Resend } from "resend";

// ⚙️ CONFIG
const RESEND_API_KEY = "re_MapsVixH_Q627UzmB9yQDaybGNukKQz6J";
const FROM_EMAIL = "Maximally <verify@maximally.in>";

const resend = new Resend(RESEND_API_KEY);

/**
 * Generate a 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

/**
 * Send verification email with OTP
 */
export async function sendVerificationEmail(to) {
  const otp = generateOTP();

  const html = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9fafb; padding: 40px;">
    <div style="max-width: 500px; margin: auto; background: white; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.08); overflow: hidden;">
      <div style="background: linear-gradient(135deg, #111827, #1e3a8a); padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">Maximally Verification</h2>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #111;">Hey there 👋,</p>
        <p style="font-size: 15px; color: #333;">Your one-time password (OTP) for verification is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e3a8a;">${otp}</div>
        </div>
        <p style="font-size: 14px; color: #666;">This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.</p>
      </div>
      <div style="background: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #6b7280;">
        &copy; ${new Date().getFullYear()} Maximally. All rights reserved.
      </div>
    </div>
  </div>`;

  try {
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to,
      subject: "Your Maximally OTP Code",
      html,
    });

    console.log("✅ Email sent:", data);
    return { success: true, otp };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error: error.message };
  }
}

// Example usage
(async () => {
  const result = await sendVerificationEmail("ggambhir1919@gmail.com");
  console.log(result);
})();
