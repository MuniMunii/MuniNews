module.exports = (sequelize, DataTypes) => {
  return sequelize.define("news", {
      news_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name_news:{
          type:DataTypes.STRING,
          allowNull:false
        },
        createdBy:{
          type:DataTypes.STRING,
          allowNull:false,
          references:{
              model:'user',
              key:'id'
          },
          onUpdate:'CASCADE',
          onDelete:'CASCADE'
        }
        ,
        createdAt:{
          type:DataTypes.DATE,
          allowNull:false
        },
        updatedAt:{
          type:DataTypes.DATE,
          allowNull:false
        },
        category:{
          type:DataTypes.STRING,
          allowNull:false
        },
        verified:{
          type:DataTypes.BOOLEAN,
          allowNull:false
        },
        status:{
          type: DataTypes.ENUM('published', 'cancelled','inreview','archived'),
          allowNull:false
        },
        description:{
          type:DataTypes.STRING,
          allowNull:true
        },
        content:{
          type:DataTypes.TEXT('long'),
          allowNull:true
        },
        cover:{
          type:DataTypes.STRING,
          allowNull:true
        }
  },{freezeTableName:true,tableName:'news',timestamps:false});
};
