import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import twilio from "twilio";
import opencage from "opencage-api-client";
import path from "path";
import { fileURLToPath } from "url";
import DoctorRouter  from "./routes/doctor.js";
import patientRouter from "./routes/patient.js";
import alertRouter from "./routes/alert.js";

// Support __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/doctor", DoctorRouter);
app.use("/api/patient", patientRouter);
app.use("/api/alert", alertRouter);





app.listen(PORT || 5000, () => {
  console.log(`🚀 Server running at http://localhost:${PORT || 5000}`);
});
