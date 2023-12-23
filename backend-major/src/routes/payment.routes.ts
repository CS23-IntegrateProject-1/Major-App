import {createPayment,
        getAllPayments,
        updatePayment, 
        createPaymentSession,
        deletePayment} from "../controllers/paymentController";
import { Router } from "express";

const payment = Router();
payment.get("/getAllPayments", getAllPayments);
payment.post("/createPayment", createPayment);
payment.put("/updatePayment", updatePayment);
payment.delete("/delete/:reservationId", deletePayment);
payment.post("/createPaymentSession", createPaymentSession);
export default payment;