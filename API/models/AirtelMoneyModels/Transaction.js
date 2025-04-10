

import {Sequelize} from 'sequelize';
import {airtelDB} from '../../config/database.js'

const {DataTypes} = Sequelize;


const Transaction = airtelDB.define("Transaction", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sender_wallet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiver_wallet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("send", "receive", "withdraw", "payment"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("success", "failed"),
        allowNull: false,
      },
      transaction_reference: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
    });
  
    Transaction.associate = (models) => {
      Transaction.belongsTo(models.Wallet, {
        foreignKey: "sender_wallet_id",
        as: "senderWallet",
      });
  
      Transaction.belongsTo(models.Wallet, {
        foreignKey: "receiver_wallet_id",
        as: "receiverWallet",
      });
    };
  

  
    export default Transaction
  