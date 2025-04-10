import {Sequelize} from "sequelize"
import AirtelMoneyUsers from "../models/AirtelMoneyModels/AirMoneyUsers.js"
import Wallets from "../models/AirtelMoneyModels/Wallets.js"
import Transaction from "../models/AirtelMoneyModels/Transaction.js"
import { handleIncomingPayment } from "../services/paymentProcessor.js";
import { processIncomingPayment } from "../services/processPaymentData.js";
import { airtelDB } from "../config/database.js"
import { v4 as uuidv4 } from 'uuid';




export const simulatePayment = async (req, res) => {
  const { senderPhone, receiverPhone, amount } = req.body;

  try {
    await airtelDB.transaction(async (t) => {
      const sender = await AirtelMoneyUsers.findOne({ where: { phone_number: senderPhone }, transaction: t });
      if (!sender) throw new Error('Sender not found');

      const senderWallet = await Wallets.findOne({ where: { user_id: sender.id }, transaction: t });
      if (!senderWallet || senderWallet.balance < amount) throw new Error('Insufficient balance');

      const receiver = await AirtelMoneyUsers.findOne({ where: { phone_number: receiverPhone }, transaction: t });
      if (!receiver) throw new Error('Receiver not found');

      const receiverWallet = await Wallets.findOne({ where: { user_id: receiver.id }, transaction: t });
      if (!receiverWallet) throw new Error('Receiver wallet not found');

      senderWallet.balance -= amount;
      await senderWallet.save({ transaction: t });

      receiverWallet.balance += amount;
      await receiverWallet.save({ transaction: t });

      await Transaction.create({
        sender_wallet_id: senderWallet.id,
        receiver_wallet_id: receiverWallet.id,
        amount,
        type: 'payment',
        status: 'success',
        transaction_reference: uuidv4()
      }, { transaction: t });
    });

    
    try {
        const paymentData = await processIncomingPayment({ senderPhone, receiverPhone, amount });
        res.status(200).json({
          message: 'Payment recorded successfully.',
          ...paymentData
        });
      } catch (innerError) {
        res.status(200).json({
          message: 'Payment simulated successfully, but receiver is not a registered customer.',
          error: innerError.message
        });
      }

  } catch (error) {
    console.error('Payment simulation error:', error);
    res.status(500).json({ message: error.message });
  }
};



