import express from  "express"

import { getPayments, getPaymentById } from "../controller/PaymentsController.js";

const paymentRouter = express.Router();

paymentRouter.get("/payments", getPayments);
paymentRouter.get("/payments/:uuid", getPaymentById);

export default paymentRouter;