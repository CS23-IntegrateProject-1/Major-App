import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

type FilmShowtime = {
    name: string;
    date: Date;
    startTime: Date;
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
        res.status(200).json(shows);
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
                if (film) {
                    filmsWithShowtimes.push({
                        name: film.name,
                        date: showtime.date,
                        startTime: showtime.startTime
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
                if (film) {
                    filmsWithShowtimes.push({
                        name: film.name,
                        date: showtime.date,
                        startTime: showtime.startTime
                    });
                }
            }
            results.push({
                screen,
                films: filmsWithShowtimes
            });
        }
    } catch (err) { 
        const error = err as Error;
        res.status(500).json({error: error.message});
    }
};

// export const getShowByTheaterId = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const screens = await prisma.screens.findMany({
//             where: {
//                 theaterId: parseInt(id)
//             }
//         });
//         let results: { screen: { screenId: number; theaterId: number; capacity: number; screenType: string; }; films: any[]; }[] = [];
//         for (let screen of screens) {
//             const showtimes = await prisma.shows.findMany({
//                 where: {
//                     screenId: screen.screenId
//                 }
//             });
//             let films: string[] = [];
//             for (let showtime of showtimes) {
//                 const film = await prisma.films.findUnique({
//                     where: {
//                         filmId: showtime.filmId
//                     }
//                 });
//                 if (film) {
//                     films.push(film.name);
//                 }
//             }
//             results.push({
//                 screen,
//                 films
//             });
//         }

//         res.status(200).json(results);
//     } catch (err) { 
//         const error = err as Error;
//         res.status(500).json({error: error.message});
//     }
// };

// export const getShowEveryTheater = async (req: Request, res: Response) => {
//     try {
//         const theaters = await prisma.theaters.findMany();
//         //let results: {theater: any; }[] = [];
//         let results: { theater: { theaterId: number; name: string; address: string; }; screens: { screenId: number; theaterId: number; capacity: number; screenType: string; }[]; }[] = [];
//         let screenDetails: { screenId: number; theaterId: number; capacity: number; screenType: string; }[] = [];
//         for (let theater of theaters) {
//             const screens = await prisma.screens.findMany({
//                 where: {
//                     theaterId: theater.theaterId
//                 }
//             });
//             for (let screen of screens) {
//                 const showtimes = await prisma.shows.findMany({
//                     where: {
//                         screenId: screen.screenId
//                     }
//                 });
//                 //let screenDetails: { screen: { screenId: number; theaterId: number; capacity: number; screenType: string; }; shows: { showtime: any; film: any }[] }[] = [];
//                 for (let screen of screens) {
//                     const showtimes = await prisma.shows.findMany({
//                         where: {
//                             screenId: screen.screenId
//                         }
//                     });
//                     let showDetails: { showtime: any; film: any }[] = [];
//                     for (let showtime of showtimes) {
//                         const film = await prisma.films.findUnique({
//                             where: {
//                                 filmId: showtime.filmId
//                             }
//                         });
//                         if (film) {
//                             showDetails.push({ showtime, film });
//                         }
//                     }
//                     screenDetails.push({
//                         screenId: screen.screenId,
//                         theaterId: screen.theaterId,
//                         capacity: screen.capacity,
//                         screenType: screen.screenType,
//                         shows: showDetails
//                     });
//                 }
//             }
//             results.push({
//                 theater,
//                 screens: screenDetails
//             });
//         }

//         res.status(200).json(results);
//     } catch (err) { 
//         const error = err as Error;
//         res.status(500).json({error: error.message});
//     }
// };

// export const getShowEveryTheater = async (req: Request, res: Response) => {
//     try {
//         const theaters = await prisma.theaters.findMany();
//         let results: { theater: { theaterId: number; name: string; address: string; }; screens: { screenId: number; theaterId: number; capacity: number; screenType: string; }[]; }[] = [];
//         for (let theater of theaters) {
//             const screens = await prisma.screens.findMany({
//                 where: {
//                     theaterId: theater.theaterId
//                 }
//             });
//             for (let screen of screens) {
//                 const showtimes = await prisma.shows.findMany({
//                     where: {
//                         screenId: screen.screenId
//                     }
//                 });
//                 let films: string[] = [];
//                 for (let showtime of showtimes) {
//                     const film = await prisma.films.findUnique({
//                         where: {
//                             filmId: showtime.filmId
//                         }
//                     });
//                     if (film) {
//                         films.push(film.name);
//                     }
//                 }
//             }
//             results.push({
//                 theater,
//                 screens,
//             });
//         }
//         res.status(200).json(results);
//     } catch (err) { 
//         const error = err as Error;
//         res.status(500).json({error: error.message});
//     }
// };
// export const getTheaterById = async (req: Request, res: Response) => {
//     try{
//         const { id } = req.params;
//         const theater = await prisma.theaters.findUnique({
//             where: {
//                 theaterId: parseInt(id)
//             }
//         });
//         if (!theater) {
//             return res.status(404).json({ error: "Theater not found" });
//         }
//         const screen = await prisma.screens.findMany({
//             where: {
//                 theaterId: parseInt(id)
//             }
//         });
//         for (let i = 0; i < screen.length; i++) {
//             const showtime = await prisma.shows.findMany({
//                 where: {
//                     screenId: screen[i].screenId
//                 }
//             });
//             const film = await prisma.films.findMany({
//                 where: {
//                     filmId: showtime[i].filmId
//                 }
//             });
//         }
//         // const showtime = await prisma.shows.findMany({
//         //     where: {
//         //         screenId: screen[0].screenId
//         //     }
//         // });
//         // const film = await prisma.films.findMany({
//         //     where: {
//         //         filmId: showtime[0].filmId
//         //     }
//         // });
//         // if (!film) {
//         //     return res.status(404).json({ error: "Film not found" });
//         // }
//         // res.status(200).json({theater, screen, showtime, film});
//     } catch (err) { 
//         const error = err as Error;
//         res.status(500).json({error: error.message});
//     }
// };