import express from "express";
import cors from "cors";
import { createDonate } from "../Controllers/donateController.js";
import { authenticateToken } from "../Utils/authMiddleware.js";

const route = express.Router();
route.use(cors());

route.post("/", /*authenticateToken,*/ (req, res, next) => {
  console.log("donatecreate.route.js - req.body:", req.body);
  console.log("donatecreate.route.js - req.headers:", req.headers);
  console.log("donatecreate.route.js - req.query:", req.query);
  next();
}, createDonate);

export default route;
