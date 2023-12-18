import { Router } from "express";
import { getFilms,
         getUpcomingFilm,
         getCurrentFilm,
         getFilmById} from "../controllers/filmController";

const router = Router();
router.get("/getFilm", getFilms);
router.get("/getUpcomingFilm", getUpcomingFilm);
router.get("/getCurrentFilm", getCurrentFilm);
router.get("/getFilmById/:id", getFilmById);



export default router;