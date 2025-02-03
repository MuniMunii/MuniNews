const express = require('express');
const axios = require('axios');
// const connection = require('../config/database.db');
const {User}=require('../config/index')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')
const nodemailer=require('nodemailer')
const bcrypt=require('bcrypt');
const { where } = require('sequelize');
const router = express.Router();
router.get('/user', async (req, res) => {
    try{
        const getUser=await User.findAll()
        console.log(getUser)
        res.json(getUser)
    }catch{
        console.log('error')
    }
  })
  router.post('/login',async(req,res)=>{
    let {email,password}=req.body
    if(!email||!password){
        console.log('ga ada param')
        return res.status(400).json({messages:'Email and Password Required'})
    }else{
    try{
        const user=await User.findOne({where:{email}})
        if(!user){
            return res.status(401).json({messages:'invalid credential'})
        }
        const passIsMatch=await bcrypt.compare(password,user.password)
        // const passIsMatch=password===user.password
        if(!passIsMatch){
            return res.status(401).json({messages:'invalid password'})
        }
        const payload={
            id:user.id,
            email:user.email
        }
        const token=jwt.sign(payload,process.env.JWT_KEY,{expiresIn:process.env.JWT_DUR})
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:'lax',
            // 1hari nanti diganti pas deket deploy
            maxAge:24 * 60 * 60 * 1000
        })
        res.json({name:user.nama_user})
    }catch(error){
        console.log('login Error')
        return res.status(500).json({ message: 'Server error' });
    }}
  })
//   route test endpoint user
  router.get('/me',async (req,res)=>{
    try{
    const token=req.cookies.token
    const decoded=jwt.verify(token,process.env.JWT_KEY)
    const user=await User.findOne({where:{id:decoded.id}})
    if(!user){
        return res.status(401).json({messages:'unauthorized'})
    }
    res.json({name:user.nama_user})
}
    catch(error){
        return res.status(401).json({messages:'invalid token'})
    }
  })
  router.post('/logout',(req,res)=>{
    res.clearCookie("token")
    res.json({messages:'logout successfull'})
  })
//   route forgotpassword
router.post('/forgot-password',async(req,res)=>{
    const {email}=req.body
    const ONE_HOUR=3600000
    if(!email){return res.json({messages:'Email not found'})}
    const user=await User.findOne({where:{email}})
    if(!user){return res.json({messages:'Sser not found'})}
    const resetToken=crypto.randomBytes(32).toString('hex')
    user.resetToken=resetToken
    user.resetTokenExpiry=Date.now()+ONE_HOUR
    await user.save()
    const transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{user:process.env.EMAIL_TEST,pass:process.env.EMAIL_TEST_NODEMAILER}
    })
    const resetLink=`http://localhost:3000/reset-password/${resetToken}`
    await transporter.sendMail({
        from:'Muninews Admin (Ramzi)',
        to:email,
        subject:'Reset Password',
        html:'<p>Click <a href="${resetLink}">here</a> to reset your password.</p>'
    })
    res.json({messages:'Reset email has been sent'})
})
// forgotpassword dengan token
router.post('/forgot-password/:token',async(req,res)=>{
    const {token}=req.params
    const {newPass}=req.body
    const user=User.fineOne({
        where:{resetToken:token,resetTokenExpiry:{[Op.gt]:Date.now()}}
    })
    if(!user){return res.json({messages:'Invalid / Token Invalid'})}
    user.password=newPass
    user.resetToken=null
    user.resetTokenExpiry=null
    await user.save
    res.json('Password changed successfully')
})
  module.exports = router;