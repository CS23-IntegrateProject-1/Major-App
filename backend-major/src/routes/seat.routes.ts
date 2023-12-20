import { getSeatByScreenIdAndShowId,
        reserveSeatForShow,
        getUniqueSeatTypeByScreenId,
        getInfoBySeatId,
        getTotalSeatsRowsColumns,
        getAvailableSeatIdByShowIdAndScreenId,
        getAllSeats,
        getAllSeatType} from "../controllers/seatController";
import { Router } from "express";

const seat = Router();

seat.get("/getAllSeats", getAllSeats);
seat.use("/getSeatInfoByScreenId/:id/:showid", getSeatByScreenIdAndShowId);
seat.post("/reserveSeatForShow/:showId", reserveSeatForShow);
seat.get("/getUniqueSeatTypeByScreenId/:id/:showid", getUniqueSeatTypeByScreenId);
seat.get("/getInfoBySeatId/:id", getInfoBySeatId);
seat.get("/getTotalSeatsRowsColumns/:screenId", getTotalSeatsRowsColumns);
seat.get("/getAvailableSeatIdByShowIdAndScreenId/:showId/:screenId", getAvailableSeatIdByShowIdAndScreenId);
seat.get("/getAllSeatType", getAllSeatType);


export default seat;