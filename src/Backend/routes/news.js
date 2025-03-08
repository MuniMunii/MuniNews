const express = require("express");
const axios = require("axios");
const { News, User } = require("../config/index.js");
const connection = require("../config/database.db");
const { where, UUIDV4, Model } = require("sequelize");
const router = express.Router();
const uuid = require("uuid");
const verifyToken = require("../middleware/token.js");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const { to } = require("@react-spring/web");
const { start } = require("repl");
// const ss=require('../assets/cover')
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
const upload = multer({ storage: storage });
// router external API CurrentNews
router.get("/currentnews", async (req, res) => {
  const { page_size } = req.query;
  try {
    const baseURLCurrentAPI = "https://api.currentsapi.services/v1/latest-news";
    const apiKey = process.env.API_KEY;
    const newUrlParameter = new URLSearchParams({
      apiKey,
      page_size: page_size || 5,
    }).toString();
    const currentAPI = `${baseURLCurrentAPI}?${newUrlParameter}`;
    console.log(currentAPI);
    const response = await axios.get(currentAPI);
    res.json(response.data);
  } catch (error) {
    console.log("error:", error);
  }
});
// get semua news tanpa query
router.get("/get-news", async (req, res) => {
  try {
    const getAllNews = await News.findAll({
      include: [{ model: User, as: "nama_user", attributes: ["nama_user"] }],
    });
    const sterilizeNews = getAllNews.map((news) => {
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
      };
    });
    res.status(200).json({ news: sterilizeNews });
  } catch (error) {
    return res.status(403).json({ messages: "server error try again", error });
  }
});
// get pakai query untuk performance
router.get("/query-news", async (req, res) => {
  try {
    let {pages}=req.query
    pages=parseInt(pages)||1
    const getAllNews = await News.findAll({
      include: [{ model: User, as: "nama_user", attributes: ["nama_user"],}],
      order:[["updatedAt","DESC"]]
    });
    const pageSize=5
    const startNews=(pages-1)*5
    const endIndex=startNews+pageSize
    const sterilizeNews = getAllNews.slice(startNews,endIndex).map((news) => {
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
      };
    });
    res.status(200).json({ news: sterilizeNews });
  } catch (error) {
    console.log('error :',error)
    return res.status(403).json({ messages: "server error try again", error });
  }
});
// router make news
router.post("/make-news", async (req, res) => {
  let { user, isAuth, title, category, description } = req.body;
  title = title.trim();
  description = description.trim().replace(/\s+/g, " ");
  // nanti di tambah buat category validation
  if(category!=='Politics'||category!=='Sciences'||category!=='Tech'||category!=='General'||category!=='Sport'){
    return res.status(403).json({messages:'Choose the category'})
  }
  if (title.length === 0) {
    return res.status(403).json({ messages: "Title cannot be empty" });
  }
  if (description.length === 0) {
    return res.status(403).json({ messages: "Description cannot be empty" });
  }
  try {
    const date = new Date();
    const DATE_FORMAT = date.toISOString().slice(0, 19).replace("T", " ");
    const userQuery = await User.findOne({ where: { nama_user: user } });
    if (!userQuery) {
      return res.status(403).json({ messages: "User not found" });
    }
    if (!isAuth) {
      return res.status(403).json({ messages: "Not Authenticated" });
    }
    const newNews = News.build({
      name_news: title,
      createdBy: userQuery.id,
      createdAt: DATE_FORMAT,
      updatedAt: DATE_FORMAT,
      category: category,
      verified: false,
      status: "archived",
      description: description,
      content: "empty",
    });
    await newNews.save();
    res
      .status(200)
      .json({
        messages: "News Added redirected to edit news",
        news_id: newNews.news_id,
      });
  } catch (error) {
    return res
      .status(403)
      .json({ messages: `Server error try again: ${error}` });
  }
});
// router get semua news di user
router.get("/my-news", verifyToken, async (req, res) => {
  try {
    const userQuery = await User.findOne({ where: { id: req.user.id } });
    if (!userQuery) {
      return res.status(403).json({ messages: "User not found" });
    }
    const news = await News.findAll({ where: { createdBy: userQuery.id } });
    if (!news) {
      return res.status(403).json({ messages: "News not found" });
    }
    res.status(200).json({ messages: "News found", news });
  } catch (error) {
    return res.status(403).json({ messages: "server error try again", error });
  }
});
// router get news value sesuai param/idnews
router.get("/get-news/:news_id", async (req, res) => {
  const { news_id } = req.params;
  const news = await News.findOne({ where: { news_id: news_id } });
  if (!news) {
    return res.status(403).json({ messages: "News not found" });
  }
  try {
    res.status(200).json({ messages: "News found", news });
  } catch (error) {
    return res.status(403).json({ messages: "server error try again", error });
  }
});
// router auto save
router.post("/edit-news/save-value/:news_id", async (req, res) => {
  const { news_id } = req.params;
  const { title, description, content } = req.body;
  const date = new Date();
  const DATE_FORMAT = date.toISOString().slice(0, 19).replace("T", " ");
  try {
    const news = await News.findOne({ where: { news_id: news_id } });
    if (!news) return res.status(403).json({ messages: "News not found" });
    await news.update({
      name_news: title,
      description: description,
      content: content,
      updatedAt:DATE_FORMAT
    });
    res.status(200).json({ messages: "News Saved" });
  } catch (error) {
    return res
      .status(403)
      .json({ messages: "server error try again: ", error });
  }
});
// router add cover
router.post(
  "/edit-news/save-cover/:news_id/:folder",
  upload.single("cover"),
  async (req, res) => {
    const { news_id } = req.params;
    const folder = req.params.folder;
    try {
      const news = await News.findOne({ where: { news_id: news_id } });
      if (!news) {
        return res.status(403).json({ messages: "news not found" });
      }
      if (!req.file) {
        return res.status(403).json({ messages: "no file uploaded" });
      }
      const filePath = `/assets/${folder}/${req.file.filename}`;
      news.cover = filePath;
      await news.save();
      res.status(200).json({ messages: "file uploaded", filePath });
    } catch (error) {
      return res
        .status(403)
        .json({ messages: "server error try again: ", error });
    }
  }
);
// router user ingin meng publish
router.post('/edit-news/publish/:news_id',async (req,res)=>{
  const {news_id}=req.params
  try{
    const news=await News.findOne({where:{news_id:news_id}})
    if(!news){
      return res.status(403).json({messages:'News not found'})
    }
    if(news.status==='inreview'){return res.status(403).json({messages:'News In review Wait for validation'})}
    await news.update({
      status:'inreview'
    })
    res.status(200).json({messages:'News in review wait for validation'})
  }catch(error){return res.status(403).json({messages:'Server error try again'})}
})
router.post('/edit-news/delete-news/:news_id',async (req,res)=>{
  const {news_id}=req.params
  try{
    const news=await News.findOne({where:{news_id:news_id}})
    if(!news){
      return res.status(403).json({messages:'News not found'})
    }
    await news.destroy()
    res.status(200).json({messages:'News successfully deleted'})
  }catch(error){return res.status(403).json({messages:'Server error try again'})}
})
// router news admin untuk memverified news
router.post(`/publish-news/:news_id`,async(req,res)=>{
  const {news_id}=req.params
  try{
    const news=await News.findOne({where:{news_id:news_id}})
    const user=await User.findOne({where:{id:news.createdBy}})
    if(!news){
      return res.status(403).json({messages:'News not found'})
    }
    const transporter=nodemailer.createTransport({
      service:'gmail',
      auth:{
        user:process.env.EMAIL_TEST,
        pass:process.env.EMAIL_TEST_PASSWORD
      }
    })
    const mail={
      from:'Muninews admin (Ramzi)',
      to:user.email,
      subject:'Published News',
      html:`<p>News Published you can check your Dashboard</p>`
    }
    await transporter.sendMail(mail)
    await news.update({
      verified:true,
      status:'published'
    })
    res.status(200).json({messages:'News Published'})
  }catch(error){return res.status(403).json({messages:'Server Error'})}
})
// router untuk menggagalkan news yang di tolak
router.post(`/cancel-news/:news_id`,async(req,res)=>{
  const {news_id}=req.params
  const {messages}=req.body
  try{
    const news=await News.findOne({where:{news_id:news_id}})
    const user=await User.findOne({where:{id:news.createdBy}})
    if(!news){return res.status(403).json({messages:'News not found'})}
    const transporter=nodemailer.createTransport({
      service:'gmail',
      auth:{
        user:process.env.EMAIL_TEST,
        pass:process.env.EMAIL_TEST_PASSWORD
      }
    })
    const mail={
      from:'Muninews admin (Ramzi)',
      to:user.email,
      subject:'Published News',
      html:`<p>News Failed to Publish you can check your Dashboard </br> Reason: ${messages}   </p>`
    }
    await transporter.sendMail(mail)
    await news.update({
      status:'cancelled'
    })
    res.status(200).json({messages:'Successfully change status'})
  }catch(error){return res.status(403).json({messages:'Server Error'})}
})
module.exports = router;
