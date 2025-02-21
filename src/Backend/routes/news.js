const express = require("express");
const axios = require("axios");
const { News,User } = require("../config/index.js");
const connection = require("../config/database.db");
const { where, UUIDV4 } = require("sequelize");
const router = express.Router();
const uuid=require('uuid');
const verifyToken = require("../middleware/token.js");
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
router.post("/make-news", async (req, res) => {
  const { user, isAuth, title, category, description } = req.body;
  try {
    const date = new Date();
    const DATE_FORMAT = date.toISOString().slice(0, 19).replace("T", " ");
    const {v4:uuidv4}=uuid
    const userQuery=await User.findOne({where:{nama_user:user}})
    if (!userQuery) {
      return res.status(403).json({ messages: "User not found" });
    }
    if (!isAuth) {
      return res.status(403).json({ messages: "Not Authenticated" });
    }
    const newNews=News.build({
      name_news: title.trim(),
      createdBy: userQuery.id,
      createdAt: DATE_FORMAT,
      updatedAt: DATE_FORMAT,
      category:category,
      verified: false,
      status:'archived',
      description: description.trim().replace(/\s+/g," "),
      content: "empty",
    });
    await newNews.save()
     res.status(200).json({messages:'News Added redirected to edit news',news_id:newNews.news_id})
  } catch (error) {
    return res.status(403).json({ messages: `Server error try again: ${error}`});
  }
});
router.get("/my-news",verifyToken,async (req,res)=>{
  try{
    const userQuery=await User.findOne({where:{id:req.user.id}})
    if(!userQuery){
      return res.status(403).json({messages:'User not found'})
    }
    const news=await News.findAll({where:{createdBy:userQuery.id}})
    if(!news){
      return res.status(403).json({messages:'News not found'})
    }
    res.status(200).json({messages:'News found',news})
  }catch(error){return res.status(403).json({messages:'server error try again',error})}
})
router.get("/edit-news/:news_id",async(req,res)=>{
  const {news_id}=req.params
  const {title}=req.body
  const news=await News.findOne({where:{news_id:news_id}})
  if(!news){
    return res.status(403).json({messages:'News not found'})
  }
  try{
    res.status(200).json({messages:'News found',news})
  }catch(error){return res.status(403).json({messages:'server error try again',error})}
})
module.exports = router;
