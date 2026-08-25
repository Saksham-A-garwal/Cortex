const nodemailer = require("nodemailer");
const dns = require("dns").promises;

const isEmailConfigured = () => Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

// nodemailer resolves BOTH A and AAAA records for the SMTP host, then - per its own
// source (lib/shared/index.js formatDNSValue) - picks a RANDOM address from the combined
// list to connect to, not an IPv4-first one. On a network with no IPv6 route (confirmed on
// Render via repeated "connect ENETUNREACH 2607:f8b0:...:587" failures), that's a coin
// flip every send: nodemailer has no public option that changes this (`family` and a
// `lookup` override are both silently ignored - grepped the installed package to confirm).
//
// Resolving to a literal IPv4 address ourselves and handing THAT to nodemailer sidesteps
// its resolver entirely: nodemailer only does its address-selection dance when given a
// hostname (net.isIP() check short-circuits it for a literal IP). `servername` is set
// separately so TLS still validates the certificate against the real hostname, not the IP.
const resolveSmtpIPv4 = async (host) => {
  try {
    // dns.lookup() goes through the OS's own resolver (the same path net.connect() would
    // use internally) rather than dns.resolve4()'s raw DNS query to a resolver server -
    // the latter needs outbound access to a DNS server specifically and failed outright in
    // one sandboxed environment this was tested in, which is exactly the kind of
    // network-shape surprise that caused the original bug. Explicit `family: 4` still gets
    // us a guaranteed-IPv4 result without nodemailer's own coin-flip address selection.
    const { address } = await dns.lookup(host, { family: 4 });
    return address || null;
  } catch (error) {
    console.error(`Could not resolve an IPv4 address for ${host}:`, error.message);
    return null;
  }
};

const buildTransporter = async () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const ipv4Host = await resolveSmtpIPv4(host);

  return nodemailer.createTransport({
    host: ipv4Host || host,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: { servername: host },
  });
};

const deliver = async ({ to, subject, text, html }) => {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n--- EMAIL (dev, not sent) ---\nTo: ${to}\nSubject: ${subject}\n${text}\n---\n`);
      return { sent: false, reason: "not_configured_dev_logged" };
    }
    console.error("Email not sent: SMTP is not configured.");
    return { sent: false, reason: "not_configured" };
  }

  try {
    const mailer = await buildTransporter();
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
