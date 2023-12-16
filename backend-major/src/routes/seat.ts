import { getSeatByScreenIdAndShowId,
        reserveSeatForShow,
        getUniqueSeatTypeByScreenId,
        getInfoBySeatId,
        getTotalSeatsRowsColumns,
        getAvailableSeatIdByShowIdAndScreenId} from "../controllers/seatController";
import { Router } from "express";

const router = Router();

router.use("/getSeatInfoByScreenId/:id/:showid", getSeatByScreenIdAndShowId);
router.post("/reserveSeatForShow/:showId", reserveSeatForShow);
router.get("/getUniqueSeatTypeByScreenId/:id/:showid", getUniqueSeatTypeByScreenId);
router.get("/getInfoBySeatId/:id", getInfoBySeatId);
router.get("/getTotalSeatsRowsColumns/:screenId", getTotalSeatsRowsColumns);
router.get("/getAvailableSeatIdByShowIdAndScreenId/:showId/:screenId", getAvailableSeatIdByShowIdAndScreenId);


export default router;