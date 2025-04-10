import { Sequelize } from 'sequelize';
import Customers from '../models/Customers.js';
import MonthlyBills from '../models/MonthlyBills.js';
import Payments from '../models/Payments.js';

export const generateMonthlyReport = async (year, month) => {
  try {
    // Input validation
    if (isNaN(year) || isNaN(month)) {
      throw new Error('Invalid year or month provided');
    }

    // Calculate date ranges
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    // Execute all queries in parallel for better performance
    const [
      totalCustomers,
      newCustomers,
      monthlyPayments,
      monthlyBills,
      billStatus,
      dailyPayments,
      topCustomers
    ] = await Promise.all([
      Customers.count(),
      Customers.count({
        where: {
          createdAt: {
            [Sequelize.Op.between]: [startDate, endDate]
          }
        }
      }),
      Payments.sum('amount', {
        where: {
          paymentDate: {
            [Sequelize.Op.between]: [startDate, endDate]
          }
        }
      }),
      MonthlyBills.sum('amount', {
        where: {
          billingMonth: {
            [Sequelize.Op.between]: [startDate, endDate]
          }
        }
      }),
      MonthlyBills.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('uuid')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount']
        ],
        where: {
          billingMonth: {
            [Sequelize.Op.between]: [startDate, endDate]
          }
        },
        group: ['status']
      }),
      Payments.findAll({
        attributes: [
          [Sequelize.fn('DATE', Sequelize.col('paymentDate')), 'date'],
          [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount'],
          [Sequelize.fn('COUNT', Sequelize.col('uuid')), 'paymentCount']
        ],
        where: {
          paymentDate: {
            [Sequelize.Op.between]: [startDate, endDate]
          }
        },
        group: [Sequelize.fn('DATE', Sequelize.col('paymentDate'))],
        order: [[Sequelize.fn('DATE', Sequelize.col('paymentDate')), 'ASC']]
      }),
      Payments.findAll({
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('Payments.amount')), 'totalPaid'],
          [Sequelize.col('Customer.fullName'), 'customerName'],
          [Sequelize.col('Customer.phoneNumber'), 'phoneNumber']
        ],
        include: [{
          model: Customers,
          as: 'Customer',
          attributes: []
        }],
        where: {
          paymentDate: {
            [Sequelize.Op.between]: [startDate, endDate]
          }
        },
        group: ['Payments.customerId'],
        order: [[Sequelize.fn('SUM', Sequelize.col('Payments.amount')), 'DESC']],
        limit: 5
      })
    ]);

    return {
      period: `${year}-${month.toString().padStart(2, '0')}`,
      totalCustomers,
      newCustomers,
      monthlyPayments: monthlyPayments || 0,
      monthlyBills: monthlyBills || 0,
      billStatus,
      dailyPayments,
      topCustomers,
      collectionRate: monthlyPayments && monthlyBills ? 
        (monthlyPayments / monthlyBills * 100).toFixed(2) : 0
    };
  } catch (error) {
    console.error('Error in generateMonthlyReport:', error);
    throw error; // Re-throw for controller to handle
  }
};

// Other service functions (getCustomerSegmentation, getAnnualSummary, getOverdueBillsReport)
// remain the same as in previous examples