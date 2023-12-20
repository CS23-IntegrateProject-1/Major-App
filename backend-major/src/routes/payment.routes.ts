import {createPayment,
        getAllPayments,
        updatePayment, 
        createPaymentSession} from "../controllers/paymentController";
import { Router } from "express";

const payment = Router();
payment.get("/getAllPayments", getAllPayments);
payment.post("/createPayment", createPayment);
payment.put("/updatePayment", updatePayment);
payment.post("/createPaymentSession", createPaymentSession);
export default payment;