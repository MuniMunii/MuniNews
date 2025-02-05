const express = require("express");
const { User } = require("../config/index");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const verifyToken = require("../middleware/token");
const router = express.Router();
const { Op } = require("sequelize");
router.get("/user", async (req, res) => {
  try {
    const getUser = await User.findAll();
    console.log(getUser);
    res.json(getUser);
  } catch {
    console.log("error");
  }
});
// test get with token
router.get("/user-token", verifyToken, async (req, res) => {
  try {
    const getUser = await User.findAll();
    console.log(getUser);
    res.json(getUser);
  } catch {
    console.log("error");
  }
});
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    console.log("ga ada param");
    return res.status(400).json({ messages: "Email and Password Required" });
  } else {
    try {
      const cookiesToken = req.cookies.token;
      if (cookiesToken) {
        try {
          return res.status(403).json({ messages: "You already Login" });
        } catch (error) {
          return res.status(400).json({ messages: "You already login" });
        }
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ messages: "invalid credential" });
      }
      const passIsMatch = await bcrypt.compare(password, user.password);
      // const passIsMatch=password===user.password
      if (!passIsMatch) {
        return res.status(401).json({ messages: "invalid password" });
      }
      const payload = {
        id: user.id,
        email: user.email,
      };
      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_DUR,
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        // 1hari nanti diganti pas deket deploy
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ name: user.nama_user });
    } catch (error) {
      console.log("login Error");
      return res.status(500).json({ message: "Server error" });
    }
  }
});
//   route test endpoint user
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ messages: "unauthorized" });
    }
    res.json({ name: user.nama_user });
  } catch (error) {
    return res.status(401).json({ messages: "invalid token" });
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ messages: "logout successfull" });
});
//   route forgotpassword
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const ONE_HOUR = 3600000;
  if (!email) {
    return res.status(403).json({ messages: "Email not found" });
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(403).json({ messages: "User not found" });
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + ONE_HOUR;
  await user.save();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_TEST,
      pass: process.env.EMAIL_TEST_PASSWORD,
    },
  });
  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
  const mail = {
    from: "Muninews Admin (Ramzi)",
    to: email,
    subject: "Reset Password",
    // nanti di style kalo ada waktu
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };
  try {
    const info = await transporter.sendMail(mail);
    return res
      .status(200)
      .json({ messages: "Mail is send, Check your email", token: resetToken });
  } catch (error) {
    return res.status(403).json({ messages: "Mail not send, Try again" });
  }
});
// forgotpassword dengan token
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword, verifyPassword } = req.body;
  const user = await User.findOne({
    where: { resetToken: token, resetTokenExpiry: { [Op.gt]: Date.now() } },
  });
  if (!newPassword || !verifyPassword) {
    return res.status(403).json({ messages: "must input password" });
  }
  if (!user) {
    return res.status(403).json({ messages: "Invalid / Token Invalid" });
  }
  if (newPassword !== verifyPassword) {
    return res.status(403).json({ messages: "Password not match" });
  }
  console.log('before:',user.password)
  await user.update({
    password: await bcrypt.hash(newPassword, 10),
    resetToken: null,
    resetTokenExpiry: null,
  });
  console.log('after:',user.password)
  res.status(200).json({ messages: "Password changed successfully ,Redirect to Login" });
});
module.exports = router;
