import { Router } from "express";
import { checkAvailability, createReservation } from "../controllers/reservationController";

const reservation = Router();

reservation.post("/create", createReservation);
reservation.post("/check", checkAvailability);

export default reservation;
