import { getAllScreens, getScreenInfoById } from "../controllers/screenController";
import { Router } from "express";

const router = Router();

router.get("/getAllScreens", getAllScreens);
router.use("/getScreenInfoById/:id", getScreenInfoById);

export default router;