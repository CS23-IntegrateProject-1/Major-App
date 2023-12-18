import { getShowByTheaterId,
         getShowEveryTheater,
         getShowFromFilmId,
         getShowByTheaterIdAndDate,
         getShowFromFilmIdAndDate,
         getShowByShowId,
         getAllShows} from "../controllers/showController";
import { Router } from "express";

const show = Router();

show.get("/getAllShows", getAllShows);
show.get("/getShowByTheaterId/:id", getShowByTheaterId);
show.get("/getShowEveryTheater", getShowEveryTheater);
show.get("/getShowFromFilmId/:id", getShowFromFilmId);
show.get("/getShowByTheaterIdAndDate/:id/:date", getShowByTheaterIdAndDate);
show.get("/getShowFromFilmIdAndDate/:id/:date", getShowFromFilmIdAndDate);
show.get("/getShowByShowId/:id", getShowByShowId);

export default show;