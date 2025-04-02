import MonthlyBills from '../models/MonthlyBills.js'
import Users from '../models/Users.js'
import Customers from "../models/Customers.js"
import Payments from "../models/Payments.js"

export const createMonthlyBill = async (req, res) => {
    try {
        const { customerId, amount, billingMonth, dueDate, status } = req.body;

        const customer = await Customers.findByPk(customerId);
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
        res.status(200).json(bills)
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

export const updateBills = async (req, res) => {
    try {
        // Debug: Log incoming UUID
        console.log('Updating bill with UUID:', req.params.uuid);
        
        const bill = await MonthlyBills.findOne({
            where: { uuid: req.params.uuid }
        });

        if (!bill) {
            console.log('No bill found for UUID:', req.params.uuid);
            return res.status(404).json({ msg: "Bill not found" });
        }

        // Debug: Log found bill
        console.log('Found bill:', bill.toJSON());

        const { amount, billingMonth, dueDate, status } = req.body;
        
        await bill.update({
            amount: parseFloat(amount),
            billingMonth: new Date(billingMonth),
            dueDate: new Date(dueDate),
            status
        });

        return res.status(200).json({ 
            msg: "Updated successfully",
            updatedBill: bill.toJSON() 
        });
        
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ msg: error.message });
    }
};

export const deleteBills = async (req, res) => {
    try {
        const bill = await MonthlyBills.findById(req.params.id);

        if(!bill){
            return res.status(404).json({msg: "Bill not found"})
        }

        await bill.destroy();
        res.status(200).json({msg: "Bill deleted successfully"})
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