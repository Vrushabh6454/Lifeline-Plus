import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    mobile: String,
    specialization: String,
    hospital: String,
    experience: Number
});

const DoctorDB = mongoose.model("DoctorDB", doctorSchema);
export default DoctorDB;
