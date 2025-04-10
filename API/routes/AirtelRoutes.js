import express from "express"
import {simulatePayment} from "../controller/AirtelMoneySimulationController.js"

const simulationRoute = express.Router();

simulationRoute.post("/simulate-payment", simulatePayment);


export default simulationRoute;


