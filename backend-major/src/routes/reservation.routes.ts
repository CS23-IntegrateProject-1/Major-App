import { Router } from "express";
import { checkAvailability, createReservation, deleteReservation, getReserveSeatByShowId } from "../controllers/reservationController";

const reservation = Router();

reservation.post("/create", createReservation);
reservation.post("/check", checkAvailability);
reservation.post("/getReserveSeatByShowId", getReserveSeatByShowId);
reservation.post("/delete", deleteReservation)

export default reservation;
