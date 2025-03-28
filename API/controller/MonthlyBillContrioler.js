import MonthlyBills from '../models/MonthlyBills.js'
import Users from '../models/Users.js'
import Customers from "../models/Customers.js"


export const createMonthlyBill = async (req, res) => {
    try {
        const { customerId, amount, billingMonth, dueDate, status } = req.body;

        const customer = await Customers.findById(customerId);
        if (!customer) {
            return res.status(404).json({ msg: "Customer not found" });
        }

        
        const bill = await MonthlyBills.create({
            customerId,
            amount,
            billingMonth,
            dueDate,
            status
        });

        
        const generateReferenceNumber = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 10; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };

    
        const payment = await Payments.create({
            customerId: customerId,
            billId: bill.uuid, 
            amount: amount,
            paymentDate: new Date(), 
            referenceNumber: generateReferenceNumber()
        });

        res.status(200).json({
            bill: bill,
            payment: payment
        });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const getAllBills = async (req, res) => {
    try {
        const bills = await MonthlyBills.findAll({
            include: Customers
        })
        res.status(200).json(biils)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const getBillById = async (req, res) => {
    try {
        const bill = await MonthlyBills.findById(req.params.id,{
            include: Customers
        })

        res.status(200).json(bill)
    } catch (error) {
        res.status(500).json({msg: error.message})
        
    }
}

export const updateBills = async (req, res) =>{
    try {
        const {amount, billingMonth, dueDate, status} = req.body;
        const bill = await MonthlyBills.findById(req.params.id);

        if(!bill){
            return res.status(404).json({msg: "Bill not found"});
        }

        await bill.update({
            amount,
            billingMonth,
            dueDate,
            status
        })
        res.json(200).json({msg: "Updated successfully"})
    } catch (error) {
      res.status(500).json({msg: error.message})
        
    }
}

export const deleteBills = async (req, res) => {
    try {
        const bill = await MonthlyBills.findById(req.params.id);

        if(!bill){
            return res.status(404).json({msg: "Bill not found"})
        }

        await bill.destroy();
        res.json(200).json({msg: "Bill deleted successfully"})
    } catch (error) {
        res.status(500).json({msg: error.message})
        
    }
}

export const searchCustomer = async (req, res) => {
    try {
        const {query} = req.query;
        const customers = await Customers.findAll({
            where: {
                [Op.or]: [
                    {fullName: {[Op.like]: `%${query}%`}},
                    
                ]
            }
        });
        res.status(200).json(customers)

    } catch (error) {
        res.status(500).json({msg: error.message})
        
    }
}