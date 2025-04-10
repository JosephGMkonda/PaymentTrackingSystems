import { Sequelize } from 'sequelize';

import { airtelDB} from '../../config/database.js';

const { DataTypes } = Sequelize;

const Wallets = airtelDB.define("Wallets", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
});

// Optional association setup
Wallets.associate = (models) => {
  Wallets.belongsTo(models.AirtelMoneyUsers, {
    foreignKey: "user_id",
    as: "user",
  });

  Wallets.hasMany(models.Transaction, {
    foreignKey: "sender_wallet_id",
    as: "sentTransactions",
  });

  Wallets.hasMany(models.Transaction, {
    foreignKey: "receiver_wallet_id",
    as: "receivedTransactions",
  });
};

export default Wallets;
