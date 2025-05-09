const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sendEmail = require('./sendEmail');

// dotenv.config();
require('dotenv').config();

const app = express();
const corsOptions = {
  origin: ['http://localhost:3000', 'https://move37capital2.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));


app.use(express.json());

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  console.log(name)
  console.log(email)
  console.log(message)

  try {
    const result = await sendEmail({ name, email, message });
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
