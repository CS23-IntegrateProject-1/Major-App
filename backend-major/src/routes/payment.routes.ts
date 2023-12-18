import {createPayment,
        getAllPayments,
        updatePayment} from "../controllers/paymentController";
import { Router } from "express";

const router = Router();
router.get("/getAllPayments", getAllPayments);
router.post("/createPayment", createPayment);
router.put("/updatePayment", updatePayment);
export default router;