const { Sequelize, DataTypes } = require("sequelize");

const sequelize=new Sequelize('muninews','root','',{
    host:'localhost',
    dialect:'mysql',
    logging:console.log,
})
const UserModel = require("../model/user");
const User = UserModel(sequelize, DataTypes);

module.exports={sequelize,User}