import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { parse } from "path";

const prisma = new PrismaClient();

export const getFilms = async (req: Request, res: Response) => {
  try {
    const films = await prisma.films.findMany();
    res.status(200).json({films});
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }  
};

export const getCurrentFilm = async (req: Request, res: Response) => {
  try {
    const currentFilm = await prisma.films.findMany({
      where: {
        releaseDate: {
          lte: new Date()
        }
      }
    });
    res.status(200).json({currentFilm});
  } catch (err) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
  }
};

export const getUpcomingFilm = async (req: Request, res: Response) => {
  try {
    const incommingFilm = await prisma.films.findMany({
      where: {
        releaseDate: {
          gt: new Date()
        }
      }
    });
    res.status(200).json({incommingFilm});
  } catch (err) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  };

  export const getFilmById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log(id);
      const filmId = parseInt(id);
      if (isNaN(filmId)) {
        return res.status(400).json({ error: "Invalid film ID" });
      }
      const film = await prisma.films.findUnique({
        where: {
          filmId: filmId,
        }
      });
      if (!film) {
        return res.status(404).json({ error: "Film not found" });
      }
      res.status(200).json(film);
    } catch (err) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
};


