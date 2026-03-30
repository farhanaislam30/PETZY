import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
},
{
    timestamps: true
}
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;