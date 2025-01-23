const express = require('express');
const axios = require('axios');
const connection = require('../config/database.db');
const router = express.Router();
  router.get('/currentnews',async (req,res)=>{
    const {page_size}=req.query
    try{
    const baseURLCurrentAPI = "https://api.currentsapi.services/v1/latest-news";
    const apiKey = process.env.API_KEY;
    const newUrlParameter = new URLSearchParams({
      apiKey,
      page_size: page_size||5,
    }).toString();
    const currentAPI = `${baseURLCurrentAPI}?${newUrlParameter}`;
    console.log(currentAPI)
    const response = await axios.get(currentAPI);
    res.json(response.data)}
    catch(error){
        console.log('error:',error)
    }
  })
  module.exports = router;