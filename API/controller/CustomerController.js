import Users from "../models/Users.js"
import Customers from "../models/Customers.js"
import AirtelMoneyUsers from "../models/AirtelMoneyModels/AirMoneyUsers.js"


const isValidAirtelNumber = (number) => {
    const localFormat = /^09[89]\d{7}$/;         
    const intlFormat = /^\+2659[89]\d{7}$/;      
    return localFormat.test(number) || intlFormat.test(number);
  };


  export const CreateCustomers = async (req, res) => {
    const { fullName, phoneNumber, accountBalance, status } = req.body;
  
    try {
      
      if (!isValidAirtelNumber(phoneNumber)) {
        return res.status(400).json({ msg: "Invalid phone number format. Use 099xxxxxxx or +26599xxxxxxx" });
      }
  
      
      const registeredUser = await AirtelMoneyUsers.findOne({ where: { phone_number: phoneNumber } });
  
      if (!registeredUser) {
        return res.status(404).json({ msg: "Phone number is not registered with Airtel Money" });
      }
  
      
      await Customers.create({
        fullName,
        phoneNumber,
        accountBalance,
        status,
        UserId: req.UserId,
      });
  
      res.status(200).json({ msg: "Customer created successfully" });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  };

  
export const getCustomers = async  (req, res) => {

    try {
        const response = await Customers.findAll({
            include:[
                {
                    model: Users,
                    attributes: ['username']
                }
            ]
        })

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message})
        
    }

}

export const findCustomerById = async (req, res) => {
    try {
        const response = await Customers.findOne({
            where: {
                uuid: req.params.id
            }
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg: error.message})
        
    }
}

export const updateCustomers = async (req, res) => {
    try {
        const customerToUpdate = await Customers.findOne({
            where: { uuid: req.params.id }
        });

        if (!customerToUpdate) {
            return res.status(404).json({ error: 'Customer not found' });
        }

    
        if (req.body.phoneNumber && req.body.phoneNumber !== customerToUpdate.phoneNumber) {
            const existingCustomer = await Customers.findOne({
                where: { phoneNumber: req.body.phoneNumber }
            });

            if (existingCustomer) {
                return res.status(400).json({ 
                    error: 'Phone number already exists',
                    existingCustomerId: existingCustomer.uuid
                });
            }
        }

        const response = await Customers.update(req.body, {
            where: { uuid: req.params.id }
        });

        res.status(200).json(response);
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteCustomer = async (req, res) => {
    try{
        const response = await Customers.destroy({
            where:{
                uuid: req.params.id
            }
        })

        res.status(200).json(response)

    }catch{
        res.status(500).json({ error: 'Internal server error' });

    }
    
}