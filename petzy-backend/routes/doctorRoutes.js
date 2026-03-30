import express from "express";
import {
  createDoctor,
  getAllDoctors,
  updateDoctorByEmail,
  deleteDoctor,
} from "../Controllers/doctorController.js";

const router = express.Router();

router.route("/")
  .get(getAllDoctors)
  .post(createDoctor);

router.route("/:email")
  .put(updateDoctorByEmail)
  .delete(deleteDoctor);

export default router;