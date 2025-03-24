import {Sequelize} from 'sequelize'
import {db} from "../config/database.js";
import MonthlyBills from "./MonthlyBills.js"
import Customers from "./Customers.js"

const {DataTypes} = Sequelize;

const Payments = db.define("Payments", {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,

        validate: {
            notEmpty: true,
        }
    },

    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    paymentDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    referenceNumber: {
        type: DataTypes.STRING,
        allowNull: false
    }

});

Payments.belongsTo(Customers, { foreignKey: 'customerId'});
Payments.belongsTo(MonthlyBills, {foreignKey: 'billId'});

export default Payments;