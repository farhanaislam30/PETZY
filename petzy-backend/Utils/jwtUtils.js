import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function generateToken(user) {
  // Include user role in the token payload
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    name: user.name
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  return accessToken;
}

export function generateRefreshToken(user) {
  // Include user role in refresh token as well
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    name: user.name
  };

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1y",
  });
  return refreshToken;
}
