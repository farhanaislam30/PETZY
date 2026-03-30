import express from "express";
import cors from "cors";
import { createCustomer } from "../Controllers/customerController.js";
//import { authenticateToken } from "../Utils/authMiddleware.js";

const route = express.Router();
route.use(cors());

route.post("/", createCustomer);

export default route;
