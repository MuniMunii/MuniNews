const express = require("express");
const axios = require("axios");
const { News } = require("../config/index.js");
const connection = require("../config/database.db");
const router = express.Router();
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
  const date = new Date();
  const DATE_FORMAT = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  if (!user) {
    return res.status(403).json({ messages: "User not found" });
  }
  if (!isAuth) {
    return res.status(403).json({ messages: "Not Authenticated" });
  }
  await News.create({
    name_news: title,
    createdBy: user,
    createdAt: DATE_FORMAT,
    updatedAt: DATE_FORMAT,
    category:category,
    verified: false,
    status:'archived',
    description: description,
    content: "",
  });
   res.status(200).json({messages:'News Added redirected to edit news'})
  try {
  } catch (error) {
    return res.status(403).json({ messages: "Server error try again" });
  }
});
module.exports = router;
