const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/./../../.env" });
const express = require("express");
const cors = require("cors");
const app = express();
const authRoute = require("./routes/auth");
const newsRoute = require("./routes/news");
const {sequelize} = require("./config/index");
const path=require('path')
const cookieparser=require('cookie-parser')
const port = 5000;
app.use(cors({origin:'http://localhost:3000',credentials:true}));
app.use(cookieparser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
sequelize
  .authenticate()
  .then(console.log("connected with sequelize"))
  .catch((err) => console.log("error cannot connected with sequelize"));
sequelize
  .sync()
  .then(console.log("sync with sequelize"))
  .catch((err) => console.log("error cannot sync with sequelize"));
app.use(`/auth`, authRoute);
app.use(`/news`, newsRoute);
app.use("/assets/cover", express.static(path.join(__dirname, "assets","cover")));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
