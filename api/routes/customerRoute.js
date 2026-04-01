import express from "express";
import cors from "cors";
import { createCustomer, getAllCustomers, updateCustomerStatus } from "../Controllers/customerController.js";
//import { authenticateToken } from "../Utils/authMiddleware.js";

const route = express.Router();
route.use(cors());

route.post("/", createCustomer);
route.get("/", getAllCustomers);
route.put("/:id", updateCustomerStatus);

export default route;
