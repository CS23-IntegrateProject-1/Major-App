import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

type FilmShowtime = {
    name: string;
    date: Date;
    startTime: string;
    screenNo: number;
  };
  
type ScreenWithFilms = {
    screen: {
      screenId: number;
      theaterId: number;
      capacity: number;
      screenType: string;
    };
    films: FilmShowtime[];
};

export const getShowFromFilmId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const shows = await prisma.shows.findMany({
            where: {
                filmId: parseInt(id)
            }
        });
        console.log(shows)
        let results: ScreenWithFilms[] = [];
        for (let show of shows) {
            const screen = await prisma.screens.findUnique({
                where: {
                    screenId: show.screenId
                }
            });
            const theater = await prisma.theaters.findUnique({
                where: {
                    theaterId: screen?.theaterId
                }
            });
            const film = await prisma.films.findUnique({
                where: {
                    filmId: show.filmId
                }
            });
            //check if screen, theater, film is not null
            if (screen && theater && film) {
                results.push({
                    screen: {
                        screenId: screen.screenId,
                        theaterId: screen.theaterId,
                        capacity: screen.capacity,
                        screenType: screen.screenType
                        
                    },
                    films: [{
                        name: film.name,
                        date: show.date,
                        startTime: show.startTime.toTimeString().split(' ')[0],
                        screenNo: screen.screen_number
                    }]
                });
            }
        }
        res.status(200).json(results);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({error: error.message});
    }
};

//film show page
export const getShowFromFilmIdAndDate = async (req: Request, res: Response) => {
    try {
        const { id, date } = req.params;
        const shows = await prisma.shows.findMany({
            where: {
                filmId: parseInt(id),
                date: new Date(date)
            }
        });
        let results: ScreenWithFilms[] = [];
        for (let show of shows) {
            const screen = await prisma.screens.findUnique({
                where: {
                    screenId: show.screenId
                }
            });
            let f: FilmShowtime[] = [];
            const film = await prisma.films.findUnique({
                where: {
                    filmId: show.filmId
                }
            });
            if (film && screen) {
                f.push({
                    name: film.name,
                    date: show.date,
                    startTime: show.startTime.toTimeString().split(' ')[0],
                    screenNo: screen.screen_number
                });
            }
            if (screen && f.length > 0) {
                results.push({
                    screen,
                    films: f
                });
            }
        }
        res.status(200).json(results);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({error: error.message});
    }
};

export const getShowByTheaterId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const screens = await prisma.screens.findMany({
            where: {
                theaterId: parseInt(id)
            }
        });
        let results: ScreenWithFilms[] = [];
        for (let screen of screens) {
            const showtimes = await prisma.shows.findMany({
                where: {
                    screenId: screen.screenId
                }
            });
            let filmsWithShowtimes: FilmShowtime[] = [];
            for (let showtime of showtimes) {
                const film = await prisma.films.findUnique({
                    where: {
                        filmId: showtime.filmId
                    }
                });
                if (film && showtime) {
                    filmsWithShowtimes.push({
                        name: film.name,
                        date: showtime.date,
                        startTime: showtime.startTime.toTimeString().split(' ')[0],
                        screenNo: screen.screen_number
                    });
                }
            }
            results.push({
                screen,
                films: filmsWithShowtimes
            });
        }
        res.status(200).json(results);
    } catch (err) { 
        const error = err as Error;
        res.status(500).json({error: error.message});
    }
};

export const getShowByTheaterIdAndDate = async (req: Request, res: Response) => {
    try {
        const { id, date } = req.params;
        const screens = await prisma.screens.findMany({
            where: {
                theaterId: parseInt(id)
            }
        });
        console.log(screens)
        if (!screens) {
            res.status(404).json({error: "Screen not found"});
        }
        let results: ScreenWithFilms[] = [];
        for (let screen of screens) {
            const showtimes = await prisma.shows.findMany({
                where: {
                    screenId: screen.screenId,
                    date: new Date(date)
                }
            });
            let filmsWithShowtimes: FilmShowtime[] = [];
            for (let showtime of showtimes) {
                const film = await prisma.films.findUnique({
                    where: {
                        filmId: showtime.filmId
                    }
                });
                if (film && showtime) {
                    filmsWithShowtimes.push({
                        name: film.name,
                        date: showtime.date,
                        startTime: showtime.startTime.toTimeString().split(' ')[0],
                        screenNo: screen.screen_number
                    });
                }
            }
            if (filmsWithShowtimes.length > 0){
                results.push({
                    screen,
                    films: filmsWithShowtimes
                });
            }
        }
        res.status(200).json(results);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({error: error.message});
    }
}

export const getShowEveryTheater = async (req: Request, res: Response) => {
    try {
        const screens = await prisma.screens.findMany();
        let results: ScreenWithFilms[] = [];
        for (let screen of screens) {
            const showtimes = await prisma.shows.findMany({
                where: {
                    screenId: screen.screenId
                }
            });
            let filmsWithShowtimes: FilmShowtime[] = [];
            for (let showtime of showtimes) {
                const film = await prisma.films.findUnique({
                    where: {
                        filmId: showtime.filmId
                    }
                });
                if (film && showtime) {
                    filmsWithShowtimes.push({
                        name: film.name,
                        date: showtime.date,
                        startTime: showtime.startTime.toTimeString().split(' ')[0],
                        screenNo: screen.screen_number
                    });
                }
            }
            results.push({
                screen,
                films: filmsWithShowtimes
            });
        }
        res.status(200).json(results);
    } catch (err) { 
        const error = err as Error;
        res.status(500).json({error: error.message});
    }
};

// export const getShowOfEveryTheaterByDate = async (req: Request, res: Response) => {
//     try {
//         const { date } = req.params;
//         const screens = await prisma.screens.findMany();
//         let results: ScreenWithFilms[] = [];
//         for (let screen of screens) {
//             const showtimes = await prisma.shows.findMany({
//                 where: {
//                     screenId: screen.screenId,
//                     date: new Date(date)
//                 }
//             });
//             let filmsWithShowtimes: FilmShowtime[] = [];
//             for (let showtime of showtimes) {
//                 const film = await prisma.films.findUnique({
//                     where: {
//                         filmId: showtime.filmId
//                     }
//                 });
//                 if (film) {
//                     filmsWithShowtimes.push({
//                         name: film.name,
//                         date: showtime.date,
//                         startTime: showtime.startTime
//                     });
//                 }
//             }
//             results.push({
//                 screen,
//                 films: filmsWithShowtimes
//             });
//         }
//         res.status(200).json(results);
//     } catch (err) { 
//         const error = err as Error;
//         res.status(500).json({error: error.message});
//     }
// }