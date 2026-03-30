import express from "express";
import {
  createUser,
  loginUser,
  deleteUser,
  getAllUsers,
  updateUserByEmail,
} from "../Controllers/userController.js";

const router = express.Router();

router.route("/").get(getAllUsers).post(createUser).put(loginUser);

router.route("/:email").put(updateUserByEmail).delete(deleteUser);

export default router;  
