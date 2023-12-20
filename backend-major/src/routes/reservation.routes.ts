import { Router } from "express";
import { createReservation } from "../controllers/reservationController";

const reservation = Router();

reservation.post("/create", createReservation);

export default reservation;
