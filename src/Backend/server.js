const dotenv=require('dotenv')
dotenv.config({path:__dirname+'/./../../.env'});
const express=require('express')
const cors=require('cors')
const app=express()
const apiRoute=require('./routes/route')
const newsRoute=require('./routes/news')
const port=5000
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(`/`,apiRoute)
app.use(`/news`,newsRoute)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })