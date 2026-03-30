import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userM from "../models/user.js";

dotenv.config();

export async function authenticateToken(req, res, next) {
  console.log("Verifying token");
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

    const retUser = await userM.findOne({ id });

    req.user = retUser;
    console.log("Verify token success");
    next();
  });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(refreshToken) {
  return jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, payload) => {
      if (err) {
        console.log("err: ", err);
        return res.error(403);
      }

      const userId = payload.aud;
      console.log("userId", userId);
      return userId;
    }
  );
}
