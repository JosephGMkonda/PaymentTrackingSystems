import { Sequelize } from 'sequelize';
import Payments from '../models/Payments.js';
import MonthlyBills from '../models/MonthlyBills.js';
import Customers from '../models/Customers.js';

const Op = Sequelize.Op;

export const NumberAnalytics = async (req, res) => {
    try {
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const [
            totalCustomers,
            activeCustomers,
            currentMonthBills,
            currentMonthPayments,
        ] = await Promise.all([
            // Total customers count
            Customers.count(),
            
            // Active customers count
            Customers.count({
                where: { status: 'active' }
            }),
            
            // Current month bills - explicitly specify table name
            MonthlyBills.findAll({
                where: {
                    billingMonth: {
                        [Op.gte]: currentMonthStart,
                        [Op.lte]: currentMonthEnd
                    }
                },
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('MonthlyBills.uuid')), 'count'],
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount'],
                    [Sequelize.literal(`SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END)`), 'paidAmount'],
                    [Sequelize.literal(`SUM(CASE WHEN status = 'unpaid' THEN amount ELSE 0 END)`), 'unpaidAmount'],
                    [Sequelize.literal(`SUM(CASE WHEN status = 'overdue' THEN amount ELSE 0 END)`), 'overdueAmount']
                ],
                raw: true
            }),

            // Current month payments - explicitly specify table name for uuid
            Payments.findAll({
                where: {
                    paymentDate: {
                        [Op.gte]: currentMonthStart,
                        [Op.lte]: currentMonthEnd
                    }
                },
                include: [{
                    model: MonthlyBills,
                    as: 'MonthlyBill', // Make sure this matches your association alias
                    where: { status: 'paid' }
                }],
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('Payments.uuid')), 'count'],
                    [Sequelize.fn('SUM', Sequelize.col('Payments.amount')), 'totalAmount']
                ],
                raw: true
            }),
        ]);

        const response = {
            customers: {
                total: totalCustomers,
                active: activeCustomers
            },
            currentMonth: {
                bills: {
                    count: currentMonthBills[0]?.count || 0,
                    totalAmount: parseFloat(currentMonthBills[0]?.totalAmount || 0),
                    paidAmount: parseFloat(currentMonthBills[0]?.paidAmount || 0),
                    unpaidAmount: parseFloat(currentMonthBills[0]?.unpaidAmount || 0),
                    overdueAmount: parseFloat(currentMonthBills[0]?.overdueAmount || 0)
                },
                payments: {
                    count: currentMonthPayments[0]?.count || 0,
                    totalAmount: parseFloat(currentMonthPayments[0]?.totalAmount || 0)
                },
                month: currentMonthStart.toLocaleString('default', { month: 'long', year: 'numeric' })
            }
        };
        
        res.status(200).json(response);
        
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ 
            message: 'Error fetching dashboard analytics', 
            error: error.message 
        });
    } 
};


export const getThreeMonthPaymentTrends = async (req, res) => {
  try {
      const now = new Date();
      
      // Calculate date range (past 3 months excluding current month)
      const startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of previous month

      // Get billing data for the period
      const billingTrends = await MonthlyBills.findAll({
          where: {
              billingMonth: {
                  [Op.gte]: startDate,
                  [Op.lte]: endDate
              }
          },
          attributes: [
              [Sequelize.fn('DATE_FORMAT', Sequelize.col('billingMonth'), '%Y-%m-01'), 'month'],
              [Sequelize.fn('COUNT', Sequelize.col('uuid')), 'billsCount'],
              [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalBilled'],
              [Sequelize.literal(`SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END)`), 'paidCount'],
              [Sequelize.literal(`SUM(CASE WHEN status = 'unpaid' THEN 1 ELSE 0 END)`), 'unpaidCount'],
              [Sequelize.literal(`SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END)`), 'overdueCount']
          ],
          group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('billingMonth'), '%Y-%m-01')],
          order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('billingMonth'), '%Y-%m-01'), 'ASC']],
          raw: true
      });

      // Get payment data for the period
      const paymentTrends = await Payments.findAll({
          where: {
              paymentDate: {
                  [Op.gte]: startDate,
                  [Op.lte]: endDate
              }
          },
          include: [{
              model: MonthlyBills,
              attributes: []
          }],
          attributes: [
              [Sequelize.fn('DATE_FORMAT', Sequelize.col('paymentDate'), '%Y-%m-01'), 'month'],
              [Sequelize.fn('COUNT', Sequelize.col('Payments.uuid')), 'paymentsCount'],
              [Sequelize.fn('SUM', Sequelize.col('Payments.amount')), 'totalPaid']
          ],
          group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('paymentDate'), '%Y-%m-01')],
          order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('paymentDate'), '%Y-%m-01'), 'ASC']],
          raw: true
      });

      // Generate all months in range
      const months = [];
      for (let i = 2; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push(date.toISOString().slice(0, 7) + '-01');
      }

      // Combine billing and payment data
      const combinedTrends = months.map(month => {
          const billing = billingTrends.find(item => item.month === month) || {};
          const payments = paymentTrends.find(item => item.month === month) || {};
          
          return {
              month: new Date(month).toLocaleString('default', { month: 'short', year: 'numeric' }),
              billing: {
                  totalBills: billing.billsCount || 0,
                  totalAmount: parseFloat(billing.totalBilled || 0),
                  paid: billing.paidCount || 0,
                  unpaid: billing.unpaidCount || 0,
                  overdue: billing.overdueCount || 0,
                  paymentRate: billing.billsCount 
                      ? ((billing.paidCount || 0) / billing.billsCount * 100).toFixed(2)
                      : 0
              },
              payments: {
                  count: payments.paymentsCount || 0,
                  totalAmount: parseFloat(payments.totalPaid || 0)
              }
          };
      });

      res.status(200).json({
          trends: combinedTrends,
          currentMonth: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
          range: {
              start: startDate.toLocaleDateString(),
              end: endDate.toLocaleDateString()
          }
      });
  } catch (error) {
      console.error('Error fetching three month payment trends:', error);
      res.status(500).json({ 
          message: 'Error fetching payment trends', 
          error: error.message 
      });
  }
};

export const getBillingTrends = async (req, res) => {
    try {
      const now = new Date();
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
      const billingTrends = await MonthlyBills.findAll({
        where: {
          billingMonth: {
            [Op.gte]: threeMonthsAgo,
            [Op.lte]: endOfCurrentMonth
          }
        },
        attributes: [
          [Sequelize.fn('DATE_FORMAT', Sequelize.col('billingMonth'), '%Y-%m-01'), 'month'],
          [Sequelize.fn('COUNT', Sequelize.col('uuid')), 'totalBills'],
          [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount'],
          [Sequelize.literal(`SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END)`), 'paidCount'],
          [Sequelize.literal(`SUM(CASE WHEN status = 'unpaid' THEN 1 ELSE 0 END)`), 'unpaidCount'],
          [Sequelize.literal(`SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END)`), 'overdueCount']
        ],
        group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('billingMonth'), '%Y-%m-01')],
        order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('billingMonth'), '%Y-%m-01'), 'ASC']],
        raw: true
      });
  
      const formattedData = billingTrends.map(item => ({
        month: new Date(item.month).toLocaleString('default', { month: 'short', year: 'numeric' }),
        totalBills: item.totalBills,
        totalAmount: parseFloat(item.totalAmount || 0),
        paidCount: item.paidCount,
        unpaidCount: item.unpaidCount,
        overdueCount: item.overdueCount,
        paymentRate: (item.paidCount / item.totalBills * 100).toFixed(2)
      }));
  
      res.status(200).json(formattedData);
    } catch (error) {
      console.error('Error fetching billing trends:', error);
      res.status(500).json({ message: 'Error fetching billing trends', error: error.message });
    }
};
  