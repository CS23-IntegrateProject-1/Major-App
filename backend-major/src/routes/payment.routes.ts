import {createPayment,
        getAllPayments,
        updatePayment} from "../controllers/paymentController";
import { Router } from "express";

const payment = Router();
payment.get("/getAllPayments", getAllPayments);
payment.post("/createPayment", createPayment);
payment.put("/updatePayment", updatePayment);
export default payment;