import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import DoctorDB from "../model/DoctorDB";

const  mongodb_URI = "mongodb+srv://vrushabhsalunke4855:vrushabh123@lifeline-plus.cpkey01.mongodb.net";

dotenv.config({ path: path.resolve(__dirname, ".env") });


const DoctorRouter = express.Router();
DoctorRouter.use(express.json());
DoctorRouter.use(express.urlencoded({ extended: true }));

await mongoose.connect(mongodb_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

DoctorRouter.post('/register', async (req, res) => {
    try {
        const { name, email , password, mobile, specialization , hospital, experience} = req.body;
        const newDoctor = new DoctorDB({ name, email, password, mobile, specialization, hospital, experience });
        await newDoctor.save();
        console.log("Saved:", newDoctor);
        res.json({ message: "Form submitted successfully!" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error saving data." });
    }
});

export default DoctorRouter;