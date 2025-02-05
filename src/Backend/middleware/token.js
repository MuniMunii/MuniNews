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
    return res.status(403).json({ messages: "Invalid Token" });
  }
};
module.exports=verifyToken;
