import { generateToken, generateRefreshToken } from "../Utils/jwtUtils.js";
import { verifyRefreshToken } from "../Utils/authMiddleware.js";

export async function refreshAllTokens(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) res.status(400);

    const userIdObj = verifyRefreshToken(refreshToken);
    const uid = userIdObj.toString();

    const token = generateToken(uid);
    console.log("token", token);
    const rtoken = generateRefreshToken(uid);
    console.log("rtoken", rtoken);

    res.status(200).json({
      message: "New tokens have been provided.",
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
