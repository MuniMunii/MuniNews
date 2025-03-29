const express = require("express");
const { User,News } = require("../config/index");
const { where } = require("sequelize");
const router=express.Router();
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const fs=require("fs");
const news = require("../model/news");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;
    folder = req.params.folder;
    if (!folder) {
      cb(new Error("folder not found"));
    }
    cb(null, path.join(__dirname, `../assets/${folder}`));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 }});
router.get('/get-user/:nama_user',async (req,res)=>{
    try{
    const {nama_user}=req.params
    const user=await User.findOne({where:{nama_user:nama_user}})
    if(!user){return res.status(403).json({messages:'User not found'})}
    const sterilizeUser={
        id:user.id,
        nama_user:user.nama_user,
        email:user.email,
        description:user.description,
        instagram:user.instagram,
        facebook:user.facebook,
        twitter:user.twitter,
        role:user.role,
        image:user.image
    }
    res.status(200).json({user:sterilizeUser})}
    catch(err){
        return res.status(403).json({messages:'Error fetching user'})
    }
})
router.post('/update-user/:id',async (req,res)=>{
    try{
    const {id}=req.params
    const {nama_user,description,instagram,facebook,twitter,password}=req.body
    const user=await User.findOne({where:{id:id}})
    if(!user){return res.status(403).json({messages:'user not found'})}
    let hashedPassword = user.password;
    // password di ganti kalo di input
    if (password) {
      const regexPassword = /^(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{5,16}$/;
      if (!regexPassword.test(password)) {
        return res.status(400).json({ message:"Password does not meet requirements" });
      }
      hashedPassword = await bcrypt.hash(password, 12);
    }    
    await user.update({
        nama_user:nama_user,
        description:description,
        instagram:instagram,
        facebook:facebook,
        twitter:twitter,
        password:hashedPassword,
    })
    res.status(200).json({messages:'User updated successfully'})
    }catch(err){
        return res.status(403).json({messages:'Error updating user'+err})
    }
})
router.post('/update-user/change-image/:id/:folder',upload.single('user'),async(req,res)=>{
    const {id}=req.params
    const {folder}=req.params
    try{
    const user=await User.findOne({where:{id:id}})
    if(!user){return res.status(403).json({messages:'user not found'})}
    const oldImagePath=path.join(__dirname,`../${user.image}`)
    if(req.file){
        const newImage=req.file.filename
        const newPath=`/assets/${folder}/${newImage}`
        if(fs.existsSync(oldImagePath)){await fs.promises.unlink(oldImagePath)}
    // const image=req.file ? req.file.filename : user.image
    // const path=`/assets/${folder}/${image}`
    user.image=newPath;
    await user.save();
    return res.status(200).json({messages:'image updated successfully',path:newPath})
    }
    return res.status(400).json({messages:'Error changing image (no image to be changed)'})
    }catch(err){return res.status(500).json({messages:'error changing image',error: err.toString()})}
})
router.post('/user-info/:nama_user/:page',async(req,res)=>{
  try{
    let {nama_user,page}=req.params
    const user=await User.findOne({where:{nama_user:nama_user}})
    if(!user){return res.status(403).json({messages:'User not found'})}
    const news=await News.findAll({where:{createdBy:user,verified:true,status:'published'},
      include: [
      { model: User, as: "nama_user", attributes: ["nama_user"] }
    ],
    order: [["updatedAt", "DESC"]]})
    const pageSize=5
    page=parseInt(page)||1
    const startNews=(page-1)*pageSize
    const endNews=startNews+pageSize
    const sterilizeUser={
      id:user.id,
      nama_user:user.nama_user,
      email:user.email,
      description:user.description,
      instagram:user.instagram,
      facebook:user.facebook,
      twitter:user.twitter,
      role:user.role,
      image:user.image
  }
    const sterilizeNews=news.slice(startNews,endNews).map((news)=>{
      return {
        news_id: news.news_id,
        name_news: news.name_news,
        createdBy: news.nama_user.nama_user,
        createdAt: news.createdAt,
        updatedAt: news.updatedAt,
        category: news.category,
        verified: news.verified,
        status: news.status,
        description: news.description,
        content: news.content,
        cover: news.cover,
      }
    })
    res.status(200).json({messages:'successfull fetched',news:sterilizeNews,user:sterilizeUser})
  }catch(error){
    return res.status(500).json({messages:'error fetching news'+error})
  }
})
module.exports=router;