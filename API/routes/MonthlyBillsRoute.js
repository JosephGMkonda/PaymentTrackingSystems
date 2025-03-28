import express from "express"

import {createMonthlyBill,getAllBills,getBillById,updateBills,deleteBills,searchCustomer} from "../controller/MonthlyBillContrioler.js"

const routes = express.Router();

routes.post("/post", createMonthlyBill);
routes.get("/getAll", getAllBills);
routes.get("/getBill/:id", getBillById);
routes.delete("/deleteBill/:id", deleteBills);
routes.patch("/updateBill/:id",updateBills);
routes.get("/search", searchCustomer);

export default routes;
