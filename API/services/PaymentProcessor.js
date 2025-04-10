import Customers from "../models/Customers.js";
import MonthlyBills from "../models/MonthlyBills.js";
import Payments from "../models/Payments.js";
import { v4 as uuidv4 } from 'uuid';


export const handleIncomingPayment = async (req, res) => {
    const { senderPhone, receiverPhone, amount } = req.body;
  
    // Check if payment was made to the correct system number
    if (receiverPhone !== SYSTEM_RECEIVER_NUMBER) {
      return res.status(400).json({ msg: 'Invalid receiver number. Payment not recognized.' });
    }
  
    try {
      // Normalize sender number
      const normalizedPhone = senderPhone.replace(/\s+/g, '');
  
      // Find the customer using sender's phone number
      const customer = await Customers.findOne({ where: { phoneNumber: normalizedPhone } });
  
      if (!customer) {
        return res.status(404).json({ msg: 'Customer not found with this phone number.' });
      }
  
      // Create bill
      const bill = await MonthlyBills.create({
        customerId: customer.uuid,
        amount,
        billingMonth: new Date(),
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        status: "paid"
      });
  
      // Create payment
      const payment = await Payments.create({
        amount,
        referenceNumber: generateRandomReference(), // make this a small helper
        paymentDate: new Date(),
        customerId: customer.uuid,
        billId: bill.uuid
      });
  
      return res.status(201).json({ bill, payment });
  
    } catch (error) {
      return res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
  };
  
