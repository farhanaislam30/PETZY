import user from "../models/user.js";
import bcrypt from "bcrypt";

async function registerUser(userData) {
  const { fullName, email, password } = userData;
  const hashedPass = await bcrypt.hash(password, 10);

  const myUser = new user({
    name: fullName,
    email: email,
    password: hashedPass,
  });

  return await myUser.save();
}

export default registerUser;
