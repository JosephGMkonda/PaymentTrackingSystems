import {Sequelize} from "sequelize"

export const db = new Sequelize("PaymentTracker", "root", "", {
    host: "localhost",
    dialect: "mysql"
});