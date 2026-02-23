const nodemailer = require('nodemailer');

async function sendEmail() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const to = process.env.EMAIL_TO || user;

  if (!user || !pass) {
    console.error('Set EMAIL_USER and EMAIL_PASS environment variables before running.');
    console.error('Example (PowerShell): $env:EMAIL_USER="you@gmail.com"; $env:EMAIL_PASS="app_password"; node emailSender.js');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  const mailOptions = {
    from: user,
    to,
    subject: 'Test email from Node.js via nodemailer',
    text: 'Hello — this is a test email sent using nodemailer.'
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response || info);
  } catch (err) {
    console.error('Error sending email:', err);
  }
}

sendEmail();
