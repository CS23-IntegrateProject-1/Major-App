import { getShowByTheaterId,
         getShowEveryTheater,
         getShowFromFilmId} from "../controllers/showController";
import { Router } from "express";

const show = Router();
show.get("/getShowByTheaterId/:id", getShowByTheaterId);
show.get("/getShowEveryTheater", getShowEveryTheater);
show.get("/getShowFromFilmId/:id", getShowFromFilmId);

export default show;