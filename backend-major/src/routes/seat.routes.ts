import { getSeatByScreenIdAndShowId,
        reserveSeatForShow,
        getUniqueSeatTypeByScreenId,
        getInfoBySeatId,
        getTotalSeatsRowsColumns,
        getAvailableSeatIdByShowIdAndScreenId,
        getAllSeats} from "../controllers/seatController";
import { Router } from "express";

const seat = Router();

seat.get("/getAllSeats", getAllSeats);
seat.use("/getSeatInfoByScreenId/:id/:showid", getSeatByScreenIdAndShowId);
seat.post("/reserveSeatForShow/:showId", reserveSeatForShow);
seat.get("/getUniqueSeatTypeByScreenId/:id/:showid", getUniqueSeatTypeByScreenId);
seat.get("/getInfoBySeatId/:id", getInfoBySeatId);
seat.get("/getTotalSeatsRowsColumns/:screenId", getTotalSeatsRowsColumns);
seat.get("/getAvailableSeatIdByShowIdAndScreenId/:showId/:screenId", getAvailableSeatIdByShowIdAndScreenId);


export default seat;