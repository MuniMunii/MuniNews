module.exports = (sequelize, DataTypes) => {
    return sequelize.define("user", {
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
            type:DataTypes.STRING,
            allowNull:false
          },
          description:{
            type:DataTypes.STRING,
            allowNull:true
          },
          content:{
            type:DataTypes.STRING,
            allowNull:true
          }
    },{freezeTableName:true,tableName:'user',timestamps:false});
  };
  