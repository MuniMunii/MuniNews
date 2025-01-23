const mysql=require('mysql')
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'muninews'
})
connection.connect((error)=>{
    if(error){
        console.log('error:',error)
    }
    console.log('Connected to the database')
})
module.exports=connection;