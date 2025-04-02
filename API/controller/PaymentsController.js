import Payments from '../models/Payments.js'
import Customers from "../models/Customers.js"
import MonthlyBills from "../models/MonthlyBills.js"



export const getPayments = async (req, res) => {
    try {
        const payments = await Payments.findAll({
            include: [
                {
                    model: Customers,
                    attributes: ['fullName', 'phoneNumber']
                },
                {
                    model: MonthlyBills,
                    attributes: ['billingMonth', 'dueDate', 'status']
                }
                
                
            ]
        })

        res.status(200).json(payments)
        
    } catch (error) {
        res.status(500).json({msg: error.message})
        
    }
}



export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payments.findOne({
            where: {
                uuid: req.params.uuid
            },
            include: [
                {
                    model: Customers,
                    attributes: ['fullName', 'phoneNumber']
                },
                {
                    model: MonthlyBills,
                    attributes: ['billingMonth', 'dueDate', 'status']
                }
            ]
        })
        res.status(200).json(payment)
    } catch (error) {
        res.status(500).json({msg: error.message})

    }
}
