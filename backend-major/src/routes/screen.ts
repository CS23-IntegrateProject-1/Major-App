import { getScreenInfoById } from "../controllers/screenController";
import { Router } from "express";

const router = Router();

router.use("/getScreenInfoById/:id", getScreenInfoById);

export default router;