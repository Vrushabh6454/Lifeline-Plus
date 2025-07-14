import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import twilio from "twilio";
import opencage from "opencage-api-client";
import path from "path";
import { fileURLToPath } from "url";

// Support __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Load env variables
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE,
  ALERT_RECEIVER_PHONE,
  OPENCAGE_API_KEY,
  PORT
} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE || !ALERT_RECEIVER_PHONE || !OPENCAGE_API_KEY) {
  console.error("❌ Missing env variables.");
  process.exit(1);
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// ✅ SOS endpoint
app.post("/send-sos", async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ success: false, error: "Missing coordinates" });
  }

  try {
    const geo = await opencage.geocode({
      q: `${latitude},${longitude}`,
      key: OPENCAGE_API_KEY,
    });

    const locationName = geo.results?.[0]?.formatted || "Unknown Location";
    const message = `🚨 SOS Alert!\n📍 Location: ${locationName}\n🌐 https://maps.google.com/?q=${latitude},${longitude}`;

    const sms = await client.messages.create({
      body: message,
      from: TWILIO_PHONE,
      to: ALERT_RECEIVER_PHONE,
    });

    console.log("✅ SMS Sent:", sms.sid);
    res.json({ success: true, sid: sms.sid });
  } catch (error) {
    console.error("❌ Twilio Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT || 5000, () => {
  console.log(`🚀 Server running at http://localhost:${PORT || 5000}`);
});
// Serve static files from t