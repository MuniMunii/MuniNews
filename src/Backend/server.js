const express=require('express')
const cors=require('cors')
const app=express()
const mysql=require('mysql')
app.use(cors())
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'muninews'
})
const port=5000
app.get('/hello', (req, res) => {
    const query='SELECT * FROM user'
    connection.query(query,(error,data)=>{
        if(error){
            console.log(error)
            return
        }
        console.log('Query Result:', data);
        res.json(data)
    })
  })
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })