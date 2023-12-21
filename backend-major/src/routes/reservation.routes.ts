import { Router } from "express";
import { createReservation, getReserveSeatByShowId } from "../controllers/reservationController";

const reservation = Router();

reservation.post("/create", createReservation);
reservation.post("/getReserveSeatByShowId", getReserveSeatByShowId);

export default reservation;
