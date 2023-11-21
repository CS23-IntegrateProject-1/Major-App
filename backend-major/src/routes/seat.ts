import { getSeatByScreenIdAndShowId,
        reserveSeatForShow,
        getUniqueSeatTypeByScreenId} from "../controllers/seatController";
import { Router } from "express";

const router = Router();

router.use("/getSeatInfoByScreenId/:id/:showid", getSeatByScreenIdAndShowId);
router.post("/reserveSeatForShow/:showId/:seatId", reserveSeatForShow);
router.get("/getUniqueSeatTypeByScreenId/:id/:showid", getUniqueSeatTypeByScreenId);


export default router;