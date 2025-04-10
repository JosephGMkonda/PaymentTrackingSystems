import express from "express";
import {getMonthlyReport } from "../controller/MonthlyReports.js";

const reportRoute = express.Router();

reportRoute.get("/monthly-report/:year/:month", getMonthlyReport );

export default reportRoute;

