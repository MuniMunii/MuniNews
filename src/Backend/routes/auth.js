const express = require("express");
const { User } = require("../config/index");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const verifyToken = require("../middleware/token");
const router = express.Router();
const { Op, where } = require("sequelize");
const uuid=require('uuid');
const { decode } = require("punycode");

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
        // ganti ke strict untuk prevent csrf
        sameSite: "lax",
        // 1hari nanti diganti pas deket deploy
        maxAge: 24 * 60 * 60 * 1000,
      });
      await user.update(
        {isAuth:1}
      )
      res.json({ name: user.nama_user,isAuth:user.isAuth,role:user.role,id:user.id });
    } catch (error) {
      console.log("login Error");
      return res.status(500).json({ message: "Server error" });
    }
  }
});
// endpoint register
router.post('/register',async (req,res)=>{
  try{
  let {email,nama_user,password,verifyPassword}=req.body
  const {v4:uuidv4}=uuid
  // sanitize dan validation
  email = email?.trim();
  nama_user = nama_user?.trim();
  password = password?.trim();
  verifyPassword = verifyPassword?.trim();
  const regexEmail =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const regexPassword = /^(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{5,16}$/;
  const isExist=await User.findOne({where:{email}})
  const isExistUsername=await User.findOne({where:{nama_user}})
  if(!email||!nama_user||!password){return res.status(400).json({messages:'all field required'})}
  if(password!==verifyPassword){return res.status(400).json({messages:'Password must match'})}
  if(!regexEmail.test(email)){return res.status(400).json({messages:'Email invalid'})}
  if(!regexPassword.test(password)){return res.status(400).json({messages:'Password invalid'})}
  if(nama_user.length<3){return res.status(400).json({messages:'Username invalid'})}
  if(isExist){
    return res.json({messages:'Email already registered'})
  }
  if(isExistUsername){
    return res.json({messages:'Username already exist'})
  }
  // insert
  const hashedPassword=await bcrypt.hash(password,12)
  await User.create({
    id:`user-${uuidv4()}`,
    email:email,
    nama_user:nama_user,
    role:'journalist',
    password:hashedPassword
  })
  res.status(200).json({messages:'User successfull registered'})
}catch(error){return res.status(500).json({messages:'Server Error, try again'})}})
//   route test endpoint user
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    let decoded =jwt.verify(token, process.env.JWT_KEY);;
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ messages: "unauthorized" });
    }
    res.json({ name: user.nama_user,isAuth:user.isAuth,role:user.role});
  } catch (error) {
    return res.status(401).json({ messages: "invalid token endpoint me" });
  }
});
router.post("/logout",verifyToken,async (req, res) => {
  try{
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const user=await User.findOne({where:{id:decoded.id}})
  await user.update({
    isAuth:0
  })
  res.clearCookie("token");
  res.json({ messages: "logout successfull" });}
  catch(error){
    res.json({messages:'Error try again'})
  }
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
