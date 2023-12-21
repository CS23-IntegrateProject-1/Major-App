import { Router } from "express";
import { checkAvailability, createReservation, getReserveSeatByShowId } from "../controllers/reservationController";

const reservation = Router();

reservation.post("/create", createReservation);
reservation.post("/check", checkAvailability);
reservation.post("/getReserveSeatByShowId", getReserveSeatByShowId);

export default reservation;
