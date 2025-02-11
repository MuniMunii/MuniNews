module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nama_user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAuth:{
      type:DataTypes.BOOLEAN,
      defaulValue:false,
      allowNull:false,
    },
    resetToken:{
      type:DataTypes.STRING,
      allowNull:true
    },
    resetTokenExpiry:{
      type:DataTypes.DATE,
      allowNull:true
    }
  },{freezeTableName:true,tableName:'user',timestamps:false});
};
