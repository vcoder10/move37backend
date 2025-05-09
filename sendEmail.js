const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config({ path: __dirname + '/.env' });

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.EMAIL_REFRESH_TOKEN;
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

console.log("CLIENT_ID:", CLIENT_ID);
console.log("CLIENT_SECRET:", CLIENT_SECRET);
console.log("REFRESH_TOKEN:", REFRESH_TOKEN);
console.log("EMAIL_SENDER:", EMAIL_SENDER);
console.log("EMAIL_RECEIVER:", EMAIL_RECEIVER)


const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendEmail({ name, email, message }) {
  try {
    const accessToken = await oAuth2Client.getAccessToken(); // ✅ define it here
    console.log("Access Token:", accessToken);
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL_SENDER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token, // ✅ use it here
      },
    });

    const mailOptions = {
      from: `Move37 Contact <${EMAIL_SENDER}>`,
      to: EMAIL_RECEIVER,
      subject: 'New Message from Move37 Website',
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

module.exports = sendEmail;
