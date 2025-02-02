const express = require('express');
const axios = require('axios');
// const connection = require('../config/database.db');
const {User}=require('../config/index')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
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
        return res.json({token:token,name:user.nama_user})
    }catch(error){
        console.log('login Error')
        return res.status(500).json({ message: 'Server error' });
    }}
  })
  module.exports = router;