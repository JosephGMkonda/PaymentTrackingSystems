import express from "express"
import {CreateCustomers, getCustomers, findCustomerById,updateCustomers } from "../controller/CustomerController.js"

const CustomerRoute = express.Router();

CustomerRoute.post("/post", CreateCustomers);
CustomerRoute.get("/getAll", getCustomers);
CustomerRoute.get("/getCustomer/:id", findCustomerById);
CustomerRoute.patch("/updateCustomer/:id", updateCustomers);

export default CustomerRoute;
