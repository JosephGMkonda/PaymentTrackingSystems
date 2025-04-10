// services/processPaymentData.js

import Customers from "../models/Customers.js";
import MonthlyBills from "../models/MonthlyBills.js";
import Payments from "../models/Payments.js";
import { generateRandomReference } from "../utils/generateReference.js";

export const processIncomingPayment = async ({ senderPhone, receiverPhone, amount }) => {
  const SYSTEM_RECEIVER_NUMBER = "+265991234515";

  if (receiverPhone !== SYSTEM_RECEIVER_NUMBER) {
    throw new Error('Invalid receiver number');
  }

  const normalizedPhone = senderPhone.replace(/\s+/g, '');
  const customer = await Customers.findOne({ where: { phoneNumber: normalizedPhone } });

  if (!customer) {
    throw new Error('Customer not found');
  }

  const bill = await MonthlyBills.create({
    customerId: customer.uuid,
    amount,
    billingMonth: new Date(),
    dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    status: "paid"
  });

  const payment = await Payments.create({
    amount,
    referenceNumber: generateRandomReference(),
    paymentDate: new Date(),
    customerId: customer.uuid,
    billId: bill.uuid
  });

  return { bill, payment };
};
