
import {Sequelize} from 'sequelize';
import {airtelDB} from '../../config/database.js'

const {DataTypes} = Sequelize;


    const AirtelMoneyUsers = airtelDB.define("AirtelMoneyUsers", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      full_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
      },
    });
  
    AirtelMoneyUsers.associate = (models) => {
        AirtelMoneyUsers.hasOne(models.Wallets, {
        foreignKey: "user_id",
        as: "wallet",
      });
    };
  

  
  export default AirtelMoneyUsers