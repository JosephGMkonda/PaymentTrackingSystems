import {Sequelize} from "sequelize"

export const db = new Sequelize("PaymentTracker", "root", "", {
    host: "localhost",
    dialect: "mysql"
});

export const airtelDB = new Sequelize("airtel_money", "root", "", {
    host: "localhost",
    dialect: "mysql"
});