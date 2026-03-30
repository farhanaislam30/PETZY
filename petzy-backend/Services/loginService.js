import user from "../models/user.js";
import bcrypt from "bcrypt";
import { generateToken } from "../Utils/jwtUtils.js";
import { verifyToken } from "../Utils/authMiddleware.js";

async function loginUser_DB(email, password) {
  try {
    let existing = await user.findOne({ email });

    if (existing) {
      const match = bcrypt.compare(password, existing.password);

      if (match) {
        //const token = generateToken(existing);
        existing = existing._doc;
        existing["password"] = "";

        const rUser = { ...existing };

        console.log("rUser", rUser);
        return rUser;
      } else {
        throw new Error("Password does not match");
      }
    } else {
      throw new Error("User does not exist");
    }
  } catch (error) {
    console.log("Login error: ", error.message);
    throw new Error("Invalid credentials!");
  }
}

async function refreshToken(oldToken) {
  try {
    const decodedToken = verifyToken(oldToken);
    user.findById(decodedToken._id);

    if (!user) {
      throw new Error("User does not exit");
    }

    const newToken = generateToken(user);
    return newToken;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export default loginUser_DB;
