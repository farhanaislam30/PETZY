import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userM from "../models/user.js";

dotenv.config();

export async function adminMiddleware(req, res, next) {
  console.log("Checking admin role");
  
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: token not found" });
  }

  const [bearer, token] = authHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: invalid auth format" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) {
      console.log("err: ", err.message);
      return res.status(403).json({ message: "Forbidden: invalid token" });
    }

    const id = user.aud;
    const retUser = await userM.findOne({ _id: id });

    if (!retUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (retUser.role !== 'admin') {
      console.log("User role:", retUser.role);
      return res.status(403).json({ message: "Forbidden: admin access required" });
    }

    req.user = retUser;
    console.log("Admin check passed");
    next();
  });
}
