import { Router } from "express";
import { getFilms,
         getUpcomingFilm,
         getCurrentFilm,
         getFilmById} from "../controllers/filmController";

const film = Router();
film.get("/getFilm", getFilms);
film.get("/getUpcomingFilm", getUpcomingFilm);
film.get("/getCurrentFilm", getCurrentFilm);
film.get("/getFilmById/:id", getFilmById);



export default film;