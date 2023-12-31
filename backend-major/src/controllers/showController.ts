import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

type FilmShowtime = {
  filmId?: number;
  name: string;
  date: Date;
  startTime: string;
  screenNo: number;
};

type ScreenWithFilms = {
  screen: {
    showId: number;
    screenId: number;
    theaterId: number;
    capacity: number;
    screenType: string;
  };
  films: FilmShowtime[];
};

type ScreenWithFilm = {
  screen: {
    screenId: number;
    theaterId: number;
    capacity: number;
    screenType: string;
  };
  films: FilmShowtime[];
};

type FilmShowtimes = {
  showId: number;
  filmId: number;
  name: string;
  date: Date;
  startTime: string;
  screenNo: number;
  screenType: string;
  posterImg: string;
  duration: number;
};

export const getAllShows = async (req: Request, res: Response) => {
  try {
    const shows = await prisma.shows.findMany();
    res.status(200).json(shows);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getShowFromFilmId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const shows = await prisma.shows.findMany({
      where: {
        filmId: parseInt(id),
      },
    });
    //console.log(shows);
    const results: ScreenWithFilms[] = [];
    for (const show of shows) {
      const screen = await prisma.screens.findUnique({
        where: {
          screenId: show.screenId,
        },
      });
      const theater = await prisma.theaters.findUnique({
        where: {
          theaterId: screen?.theaterId,
        },
      });
      const film = await prisma.films.findUnique({
        where: {
          filmId: show.filmId,
        },
      });
      //check if screen, theater, film is not null
      if (screen && theater && film) {
        results.push({
          screen: {
            showId: show.showId,
            screenId: screen.screenId,
            theaterId: screen.theaterId,
            capacity: screen.capacity,
            screenType: screen.screenType,
          },
          films: [
            {
              name: film.name,
              date: show.date,
              startTime: show.startTime.toTimeString().split(" ")[0],
              screenNo: screen.screen_number,
            },
          ],
        });
      }
    }
    res.status(200).json(results);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

//film show page
export const getShowFromFilmIdAndDate = async (req: Request, res: Response) => {
  try {
    const { id, date } = req.params;
    const shows = await prisma.shows.findMany({
      where: {
        filmId: parseInt(id),
        date: new Date(date),
      },
      orderBy: {
        startTime: "asc",
      },
    });
    //console.log(shows);
    const results: ScreenWithFilms[] = [];
    for (const show of shows) {
      const screen = await prisma.screens.findUnique({
        where: {
          screenId: show.screenId,
        },
        // orderBy: {
        //     theaterId: 'asc'
        // }
      });
      const f: FilmShowtime[] = [];
      const film = await prisma.films.findUnique({
        where: {
          filmId: show.filmId,
        },
      });
      if (film && screen) {
        f.push({
          filmId: show.filmId,
          name: film.name,
          date: show.date,
          startTime: `${show.startTime
            .getUTCHours()
            .toString()
            .padStart(2, "0")}:${show.startTime
            .getUTCMinutes()
            .toString()
            .padStart(2, "0")}`,
          screenNo: screen.screen_number,
        });
      }
      if (screen && f.length > 0) {
        results.push({
          screen: {
            showId: show.showId,
            screenId: screen.screenId,
            theaterId: screen.theaterId,
            capacity: screen.capacity,
            screenType: screen.screenType,
          },
          films: f,
        });
      }
    }
    res.status(200).json(results);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getShowByTheaterId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const screens = await prisma.screens.findMany({
      where: {
        theaterId: parseInt(id),
      },
    });
    const results: ScreenWithFilm[] = [];
    for (const screen of screens) {
      const showtimes = await prisma.shows.findMany({
        where: {
          screenId: screen.screenId,
        },
      });
      const filmsWithShowtimes: FilmShowtime[] = [];
      for (const showtime of showtimes) {
        const film = await prisma.films.findUnique({
          where: {
            filmId: showtime.filmId,
          },
        });
        if (film && showtime) {
          filmsWithShowtimes.push({
            name: film.name,
            date: showtime.date,
            startTime: showtime.startTime.toTimeString().split(" ")[0],
            screenNo: screen.screen_number,
          });
        }
      }
      results.push({
        screen,
        films: filmsWithShowtimes,
      });
    }
    res.status(200).json(results);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getShowByTheaterIdAndDate = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, date } = req.params;
    const screens = await prisma.screens.findMany({
      where: {
        theaterId: parseInt(id),
      },
    });
    //console.log(screens);
    if (!screens) {
      res.status(404).json({ error: "Screen not found" });
    }
    const results: ScreenWithFilm[] = [];
    for (const screen of screens) {
      const showtimes = await prisma.shows.findMany({
        where: {
          screenId: screen.screenId,
          date: new Date(date),
        },
      });

      const filmsWithShowtimes: FilmShowtimes[] = [];
      for (const showtime of showtimes) {
        const film = await prisma.films.findUnique({
          where: {
            filmId: showtime.filmId,
          },
        });
        if (film && showtime) {
          filmsWithShowtimes.push({
            showId: showtime.showId,
            filmId: showtime.filmId,
            name: film.name,
            posterImg: film.posterImg,
            duration: film.duration,
            date: showtime.date,
            startTime: `${showtime.startTime
              .getUTCHours()
              .toString()
              .padStart(2, "0")}:${showtime.startTime
              .getUTCMinutes()
              .toString()
              .padStart(2, "0")}`,
            screenNo: screen.screen_number,
            screenType: screen.screenType,
          });
        }
      }
      if (filmsWithShowtimes.length > 0) {
        results.push({
          screen,
          films: filmsWithShowtimes,
        });
      }
    }
    res.status(200).json(results);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getShowEveryTheater = async (req: Request, res: Response) => {
  try {
    const screens = await prisma.screens.findMany();
    const results: ScreenWithFilm[] = [];
    for (const screen of screens) {
      const showtimes = await prisma.shows.findMany({
        where: {
          screenId: screen.screenId,
        },
        orderBy: {
          startTime: "asc",
        },
      });
      const filmsWithShowtimes: FilmShowtime[] = [];
      for (const showtime of showtimes) {
        const film = await prisma.films.findUnique({
          where: {
            filmId: showtime.filmId,
          },
        });
        if (film && showtime) {
          filmsWithShowtimes.push({
            name: film.name,
            date: showtime.date,
            startTime: showtime.startTime.toTimeString().split(" ")[0],
            screenNo: screen.screen_number,
          });
        }
      }
      results.push({
        screen,
        films: filmsWithShowtimes,
      });
    }
    res.status(200).json(results);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getShowByShowId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const show = await prisma.shows.findUnique({
      where: {
        showId: parseInt(id),
      },
      include: {
        Screens: true,
        Films: true,
      },
    });
    if (!show) {
      res.status(404).json({ error: "Show not found" });
    } else {
      const startTime = `${show.startTime
        .getUTCHours()
        .toString()
        .padStart(2, "0")}:${show.startTime
        .getUTCMinutes()
        .toString()
        .padStart(2, "0")}`;
      res.status(200).json({ show, startTime });
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};
