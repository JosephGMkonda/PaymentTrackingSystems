import {Sequelize} from "sequelize";
import {db} from "../config/database.js"
import Users from './Users.js'

const {DataTypes} = Sequelize;


const Customers = db.define("Customers", {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        validate: {
            notEmpty: true
        }

    },

    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            is: /^\+?[1-9]\d{1,14}$/ 
        }
    },
    accountBalance: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.00
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'suspended'),
        allowNull: false,
        defaultValue: 'active'
    }
})

Users.hasMany(Customers)
Customers.belongsTo(Users, {foreignKey: "UserId"});

export default Customers;