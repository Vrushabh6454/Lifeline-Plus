import express from "express";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

router.post("/send", async (req, res) => {
  const { to, message } = req.body;
  try {
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: to,
    });
    res.json({ success: true, sid: sms.sid });
  } catch (err) {
    res.status(500).json({ error: "Failed to send alert", details: err.message });
  }
});

export default router;