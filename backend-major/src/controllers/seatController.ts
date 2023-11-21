import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getSeatByScreenIdAndShowId = async (req: Request, res: Response) => {
    try {
        const { id, showid } = req.params;
        const screenId = parseInt(id);
        const showId = parseInt(showid);
        if (isNaN(screenId) || isNaN(showId)) {
            return res.status(400).json({ error: "Invalid ID" });
        }
        const seats = await prisma.seats.findMany({
            where: { 
                screenId: screenId 
            },
            include: { 
                Seat_Types: true 
            }
        });
        const show = await prisma.shows.findUnique({
            where: { 
                showId: showId 
            },
            select: {
                price: true,
            }
        });

        if (!seats.length || !show) {
            return res.status(404).json({ error: "Not found" });
        }
        const seatsWithCalculatedPrices = seats.map(seat => ({
            ...seat,
            finalPrice: parseFloat(show.price.toString()) * parseFloat(seat.Seat_Types.price_modifier.toString()),
        }));

        res.status(200).json(seatsWithCalculatedPrices);

    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};


export const reserveSeatForShow = async (req: Request, res: Response) => {
    try {
        const { showId, seatId } = req.params; 
        const showIdNum = parseInt(showId);
        const seatIdNum = parseInt(seatId);

        const existingReservation = await prisma.reservation_Logs.findFirst({
            where: {
                showId: showIdNum,
                seatId: seatIdNum
            }
        });
        if (existingReservation) {
            return res.status(400).json({error: "Seat is already reserved for this show"});
        }
        const newReservation = await prisma.reservation_Logs.create({
            data: {
                showId: showIdNum,
                seatId: seatIdNum
            }
        });
        res.status(201).json(newReservation);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({error: error.message});
    }
}

export const getUniqueSeatTypeByScreenId = async (req: Request, res: Response) => {
    try {
        const { id, showid } = req.params;
        const screenId = parseInt(id);
        const showId = parseInt(showid);
        const seats = await prisma.seats.findMany({
            where: {
                screenId: screenId,
            },
            include: {
                Seat_Types: {
                    select: {
                        typeName: true,
                        price_modifier: true,
                    },
                },
            },
        });
        const show = await prisma.shows.findUnique({
            where: { 
                showId: showId 
            },
            select: {
                price: true,
            }
        });
        if (!seats) {
            return res.status(404).json({ error: "Seats not found" });
        }
        const seatTypeToPrice = new Map();

        for (const seat of seats) {
            const typeName = seat.Seat_Types.typeName;
            if (show) {
                const finalPrice = parseFloat(show.price.toString()) * parseFloat(seat.Seat_Types.price_modifier.toString());
                if (!seatTypeToPrice.has(typeName) || seatTypeToPrice.get(typeName) !== finalPrice) {
                    seatTypeToPrice.set(typeName, finalPrice);
                }
            }
        }
        const seatTypesWithPrices = Array.from(seatTypeToPrice, ([typeName, finalPrice]) => ({ typeName, finalPrice }));
        res.status(200).json(seatTypesWithPrices);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
 };