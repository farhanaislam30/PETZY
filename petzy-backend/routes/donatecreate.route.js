import express from "express";
import cors from "cors";
import { createDonate } from "../Controllers/donateController.js";
import { authenticateToken } from "../Utils/authMiddleware.js";

const route = express.Router();
route.use(cors());

route.post("/", /*authenticateToken,*/ createDonate);

export default route;
