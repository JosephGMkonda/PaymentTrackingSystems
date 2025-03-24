import {Sequelize} from "sequelize"
import {db} from "../config/database.js"
import Customers from './Customers.js'

const {DataTypes} = Sequelize;


const MonthlyBills = db.define("MonthlyBills", {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }

    },
    amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    billingMonth: {
        type: DataTypes.DATE,
        allowNull: false
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('paid', 'unpaid','overdue'),
        allowNull: false,
        defaultValue: "unpaid"
    }
})

MonthlyBills.belongsTo(Customers, {foreignKey: "customerId"});

export default MonthlyBills;