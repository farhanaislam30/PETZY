import express from "express";
import cors from "cors";
import { getAllDonates } from "../Controllers/donateController.js";
import { authenticateToken } from "../Utils/authMiddleware.js";

const route = express.Router();
route.use(cors());

route.get("/", /*authenticateToken,*/ getAllDonates);

export default route;
