const nodemailer = require('nodemailer');

// Configure SMTP credentials via environment variables for safety.
// Required env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM, TO

async function sendMail() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.FROM;
  const to = process.env.TO;

  if (!host || !port || !user || !pass || !from || !to) {
    console.error('Missing SMTP configuration. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM, TO');
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465, // true for 465, false for other ports
    auth: { user, pass },
  });

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: 'Test email from Node exercises',
      text: 'This is a test email sent from email-sender.js',
    });
    console.log('Message sent:', info.messageId || info.response);
  } catch (err) {
    console.error('Error sending email:', err.message);
  }
}

sendMail();
