import { getTheaters,
         getTheaterById,
        } from "../controllers/theatreController";
import { Router } from "express";

const theater = Router();
theater.get("/getTheaters", getTheaters);
theater.get("/getTheaterById/:id", getTheaterById);

export default theater;