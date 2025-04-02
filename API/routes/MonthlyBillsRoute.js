import express from "express"

import {createMonthlyBill,getAllBills,getBillById,updateBills,deleteBills,searchCustomer} from "../controller/MonthlyBillContrioler.js"

const routes = express.Router();

routes.post("/Billpost", createMonthlyBill);
routes.get("/getAllBills", getAllBills);
routes.get("/getBill/:id", getBillById);
routes.delete("/deleteBill/:id", deleteBills);
routes.patch("/updateBill/:uuid",updateBills);
routes.get("/search", searchCustomer);

export default routes;
