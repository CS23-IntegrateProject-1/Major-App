import { Router } from "express";
import { createReservation } from "../controllers/reservationController";

const reservation = Router();

reservation.post("/reservation/crate", createReservation);

export default reservation;
