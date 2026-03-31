import user from "../models/user.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

async function registerUser(userData) {
  const { fullName, email, password, adminCode } = userData;
  const hashedPass = await bcrypt.hash(password, 10);

  // Check if admin code is valid
  let role = 'user';
  if (adminCode && adminCode === process.env.ADMIN_SECRET_KEY) {
    role = 'admin';
  }

  const myUser = new user({
    name: fullName,
    email: email,
    password: hashedPass,
    role: role
  });

  return await myUser.save();
}

export default registerUser;
