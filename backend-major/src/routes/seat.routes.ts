import { getSeatByScreenIdAndShowId,
        reserveSeatForShow,
        getUniqueSeatTypeByScreenId,
        getInfoBySeatId,
        getTotalSeatsRowsColumns,
        getAvailableSeatIdByShowIdAndScreenId,
        getAllSeats,
        getAllSeatType,
        getHashedReserveId,
        deleteReservation,
        addWaitingLog} from "../controllers/seatController";
import { Router } from "express";

const seat = Router();

seat.get("/getAllSeats", getAllSeats);
seat.use("/getSeatInfoByScreenId/:id/:showid", getSeatByScreenIdAndShowId);
seat.post("/reserveSeatForShow/:showId", reserveSeatForShow);
seat.get("/getUniqueSeatTypeByScreenId/:id", getUniqueSeatTypeByScreenId);
seat.get("/getInfoBySeatId/:id", getInfoBySeatId);
seat.get("/getTotalSeatsRowsColumns/:screenId", getTotalSeatsRowsColumns);
seat.get("/getAvailableSeatIdByShowIdAndScreenId/:showId/:screenId", getAvailableSeatIdByShowIdAndScreenId);
seat.get("/getAllSeatType", getAllSeatType);
seat.get("/getHashedReserve/:reserve", getHashedReserveId);
seat.delete("/delete/:reservationId", deleteReservation);
seat.post("/addWaitLog", addWaitingLog);

export default seat;