import mangoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    mobile: String,
    specialization: String,
    hospital: String,
    experience: Number
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
