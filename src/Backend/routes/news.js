const express = require("express");
const axios = require("axios");
const { News, User, sequelize } = require("../config/index.js");
const connection = require("../config/database.db");
const { where, UUIDV4, Model, Op, fn, col } = require("sequelize");
const router = express.Router();
const uuid = require("uuid");
const verifyToken = require("../middleware/token.js");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const fs=require('fs')
const { URLSearchParams } = require("url");
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
router.get('/publicnews',async (req,res)=>{
  try{
  const baseURLPublicAPI="https://newsdata.io/api/1/latest"
  const apiKey=process.env.API_KEY_PUBLIC_NEWS
  const newUrlParameter=new URLSearchParams({
    apiKey,
    language:"en"
  }).toString()
  const publicAPI=`${baseURLPublicAPI}?${newUrlParameter}`
  const response=await axios.get(publicAPI);
  res.status(200).json(response.data)}catch(error){console.log('error try again',error)}
})
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
// get pakai query dan status parameter
router.get("/query-news/:status", async (req, res) => {
  try {
    const {status}=req.params
    let {pages}=req.query
    pages=parseInt(pages)||1
    const getAllNews = status==='all'?
    await News.findAll({
      include: [
        { model: User, as: "nama_user", attributes: ["nama_user"] }
      ],
      order: [["updatedAt", "DESC"]]
    }):await News.findAll({
      where: { status: status },
      include: [
        { model: User, as: "nama_user", attributes: ["nama_user"] }
      ],
      order: [["updatedAt", "DESC"]]
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
router.post("/search-news",async (req,res)=>{
  try{
    let {value}=req.body
    const news = await News.findAll({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("name_news")),
        "LIKE",
        `%${value.toLowerCase()}%`
      )
    });
  if(news.length===0){return res.status(404).json({messages:'ga ada news'})}
    res.status(200).json({news})
  }catch(error){return res.status(403).json({messages:'Failed to search'})}
})
// note 1 :benerin route ini 
// get pakai param dan category parameter
router.get("/query-news-category/:category/:pages", async (req, res) => {
  try {
    const {category}=req.params
    let {pages}=req.params
    pages=parseInt(pages)||1
    const categoryList=["Tech",'Business','Sciences','Politics','General','Sport']
    if(!categoryList.includes(category)){return res.status(403).json({messages:'Category not found'})}
    const getAllNews =await News.findAll({
      where: { category: category,verified:true },
      include: [
        { model: User, as: "nama_user", attributes: ["nama_user"] }
      ],
      order: [["updatedAt", "DESC"]]
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
  if(category===""){
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
  try {
  const news = await News.findOne({include: [{ model: User, as: "nama_user", attributes: ["nama_user"] }],where: { news_id: news_id } });
  const user=await User.findOne({where:{id:news.createdBy}})
  if (!news) {
    return res.status(403).json({ messages: "News not found" });
  }
    const sterilizeNews={
      news_id: news.news_id,
      name_news: news.name_news,
      createdBy: user.nama_user,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
      category: news.category,
      verified: news.verified,
      status: news.status,
      description: news.description,
      content: news.content,
      cover: news.cover,
    }
    res.status(200).json({ messages: "News found", news:sterilizeNews });
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
    if (news.status==='published'&&news.status){await news.update({status:'archived',verified:false});return res.status(200).json({messages:'Status Archived'})}
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
      }else{ 
        const oldImagePath=path.join(__dirname,`../${news.cover}`)
        if(fs.existsSync(oldImagePath)){
          await fs.promises.unlink(oldImagePath)
        }
      const filePath = `/assets/${folder}/${req.file.filename}`;
      news.cover = filePath;
      await news.save();
      return res.status(200).json({ messages: "file uploaded", filePath });
      }
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
  const date = new Date();
  const DATE_FORMAT = date.toISOString().slice(0, 19).replace("T", " ");
  try{
    const news=await News.findOne({where:{news_id:news_id}})
    if(!news){
      return res.status(403).json({messages:'News not found'})
    }
    if(news.status==='inreview'){return res.status(403).json({messages:'News In review Wait for validation'})}
    await news.update({
      status:'inreview',
      updatedAt:DATE_FORMAT
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
    const date = new Date();
    const DATE_FORMAT = date.toISOString().slice(0, 19).replace("T", " ");
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
    if (process.env.NODE_ENV !== "development") {
      await transporter.sendMail(mail);
    }
    await news.update({
      verified:true,
      updatedAt:DATE_FORMAT,
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
    if (process.env.NODE_ENV !== "development") {
      await transporter.sendMail(mail);
    }
    await news.update({
      status:'cancelled'
    })
    res.status(200).json({messages:'Successfully change status'})
  }catch(error){return res.status(403).json({messages:'Server Error'})}
})
module.exports = router;
