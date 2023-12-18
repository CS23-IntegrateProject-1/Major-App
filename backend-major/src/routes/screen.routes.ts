import { getAllScreens, getScreenInfoById } from "../controllers/screenController";
import { Router } from "express";

const screen = Router();

screen.get("/getAllScreens", getAllScreens);
screen.use("/getScreenInfoById/:id", getScreenInfoById);

export default screen;