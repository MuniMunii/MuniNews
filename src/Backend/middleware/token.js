const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ messages: "Unauthorized" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.user = decode;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
    })
    // connected di context fetchUser
    return res.status(403).json({messages:'invalid Token please Login Again'})
  }
    return res.status(403).json({ messages: "Invalid Token" });
  }
};
module.exports=verifyToken;
