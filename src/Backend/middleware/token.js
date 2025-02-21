const jwt = require("jsonwebtoken");
const { User } = require("../config/index.js");
const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ messages: "Unauthorized" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.user = decode;
    const userNotAuth = await User.findOne({
      where: { id: req.user.id, isAuth: false },
    });
    if (userNotAuth) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });
      return res.status(403).json({ messages: "User not authenticated" });
    }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });
      return res
        .status(403)
        .json({ messages: "Invalid Token, please login again" });
    }
    return res.status(403).json({ messages: "Invalid Token" });
  }
};
module.exports=verifyToken;
