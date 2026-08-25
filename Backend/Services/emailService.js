const nodemailer = require("nodemailer");

let transporter = null;

const isEmailConfigured = () => Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

const getTransporter = () => {
  if (!isEmailConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  }
  return transporter;
};

const deliver = async ({ to, subject, text, html }) => {
  const mailer = getTransporter();

  if (!mailer) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n--- EMAIL (dev, not sent) ---\nTo: ${to}\nSubject: ${subject}\n${text}\n---\n`);
      return { sent: false, reason: "not_configured_dev_logged" };
    }
    console.error("Email not sent: SMTP is not configured.");
    return { sent: false, reason: "not_configured" };
  }

  try {
    await mailer.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (error) {
    console.error("Email delivery failed:", error.message);
    return { sent: false, reason: "delivery_failed" };
  }
};

const sendOtpEmail = async ({ to, code, expiresInMinutes }) => {
  const subject = `${code} is your Cortex sign-in code`;

  const text = [
    `Your Cortex sign-in code is: ${code}`,
    ``,
    `It expires in ${expiresInMinutes} minutes and can only be used once.`,
    ``,
    `If you didn't try to sign in, you can ignore this email - nobody can get in without this code.`,
  ].join("\n");

  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, sans-serif; max-width: 480px;">
      <p style="font-size: 15px; color: #111;">Your Cortex sign-in code is:</p>
      <p style="font-size: 32px; font-weight: 700; letter-spacing: 6px; margin: 20px 0; color: #111;">${code}</p>
      <p style="font-size: 14px; color: #555;">
        It expires in ${expiresInMinutes} minutes and can only be used once.
      </p>
      <p style="font-size: 13px; color: #888; margin-top: 24px;">
        If you didn't try to sign in, you can ignore this email &mdash; nobody can get in without this code.
      </p>
    </div>
  `;

  return deliver({ to, subject, text, html });
};

module.exports = { isEmailConfigured, deliver, sendOtpEmail };
