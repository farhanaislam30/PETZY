import Doctor from "../models/doctorModel.js";

export const createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDoctorByEmail = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );

    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    await Doctor.findOneAndDelete({ email: req.params.email });
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};