import express from "express";

const DoctorRouter = express.Router();

DoctorRouter.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, phone, specialization, hospital, experience } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // TODO: Save to DB or mock it
    console.log("✅ Doctor Registered:", req.body);

    return res.status(200).json({ success: true, message: "Doctor registered successfully" });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});


export default DoctorRouter;