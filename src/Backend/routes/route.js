const express = require('express');
const axios = require('axios');
const connection = require('../config/database.db');
const router = express.Router();
router.get('/user', (req, res) => {
    const query='SELECT * FROM user'
    connection.query(query,(error,data)=>{
        if(error){
            console.log(error)
            return
        }
        console.log('result:', data);
        res.json(data)
    })
  })
  module.exports = router;