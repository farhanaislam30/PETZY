import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function generateToken(userId) {
  const payload = {};

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
    audience: userId,
  });
  return accessToken;
}

export function generateRefreshToken(userId) {
  const payload = {};

  const accessToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1y",
    audience: userId,
  });
  return accessToken;
}
