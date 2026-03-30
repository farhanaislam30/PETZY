import User from "../models/user.js";
import registerUser from "../Services/registerService.js";
import loginUser_DB from "../Services/loginService.js";
import { generateToken, generateRefreshToken } from "../Utils/jwtUtils.js";

export const getAllUsers = async (req, res) => {
  const allUsers = await User.find().select(["-__v"]);
  return res.status(200).json(allUsers);
};

export async function createUser(req, res) {
  try {
    const data = req.body;
    //   console.log("req.body", req.body);
    const user = await registerUser(data);

    const uid = user._id.toString();
    console.log("user._id", uid);

    const token = generateToken(uid);
    const rtoken = generateRefreshToken(uid);

    res.status(201).json({
      user: user,
      message: "User has been created.",
      token: token,
      refreshToken: rtoken,
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({
      message: error.message,
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await loginUser_DB(email, password);

    const uid = user._id.toString();
    console.log("userId", uid);

    const token = generateToken(uid);
    const rtoken = generateRefreshToken(uid);

    const rUser = {
      ...user,
      token: token,
      refreshToken: rtoken,
    };

    res.json(rUser);
  } catch (error) {
    res.status(401).json({ message: "Invalid credentials" });
  }
}

export const updateUserByEmail = async (req, res) => {
  const { email } = req.params;
  const { name: newName, email: newEmail } = req.body;

  const user = await User.findOne({ email });
  console.log(user);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const anotherUser = await User.findOne({ email: newEmail });

  if (anotherUser && anotherUser.id !== user.id) {
    return res.status(400).json({ error: "User is already in use" });
  }

  user.email = newEmail;
  user.name = newName;
  user.save();

  return res.status(200).json({ message: "User updated successfully" });
};

export const deleteUser = async (req, res) => {
  const { email } = req.params;

  const user = await User.findOne({ email: email });

  console.log(user);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  await User.deleteOne({ email });

  return res.status(200).json({ message: "User deleted" });
};
