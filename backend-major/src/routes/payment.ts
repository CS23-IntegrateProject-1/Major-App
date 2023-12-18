import {createPayment,
        updatePayment} from "../controllers/paymentController";
import { Router } from "express";

const router = Router();
router.post("/createPayment", createPayment);
router.put("/updatePayment", updatePayment);
export default router;