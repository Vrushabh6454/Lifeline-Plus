import express from 'express';
const router = express.Router();

router.post("/api/patient/register", async (req, res) => {
    try {
        const { fullName, email, password, phone, age } = req.body;
        // TODO: Add your patient registration logic here (e.g., save to DB)
        return res.status(200).json({ success: true, message: "Patient registered successfully" });
    } catch (error) {
        console.error("Error registering patient:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});

export default router;