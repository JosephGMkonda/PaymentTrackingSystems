import express from "express"
import { NumberAnalytics, getThreeMonthPaymentTrends,getBillingTrends } from "../controller/ProcessedData.js";

 

const DataRouter = express.Router();

DataRouter.get("/analytics", NumberAnalytics);
DataRouter.get("/historicalPayments", getThreeMonthPaymentTrends);
DataRouter.get("/bllingTrends", getBillingTrends);

export default DataRouter;