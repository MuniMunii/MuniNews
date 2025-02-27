const { Sequelize, DataTypes } = require("sequelize");

const sequelize=new Sequelize('muninews','root','',{
    host:'localhost',
    dialect:'mysql',
    logging:console.log,
})
const UserModel = require("../model/user");
const User = UserModel(sequelize, DataTypes)
const NewsModel = require("../model/news");
const News = NewsModel(sequelize, DataTypes);;
User.hasMany(News,{foreignKey:'createdBy'})
News.belongsTo(User,{foreignKey:'createdBy',as:'nama_user'})
module.exports={sequelize,User,News}