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
                        seatTypeId: true,
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
            const { seatTypeId, typeName, price_modifier } = seat.Seat_Types;
            if (show) {
                const finalPrice = parseFloat(show.price.toString()) * parseFloat(price_modifier.toString());
                const key = `${seatTypeId}-${typeName}`; // Use a combined key
                if (!seatTypeToPrice.has(key) || seatTypeToPrice.get(key).finalPrice !== finalPrice) {
                    seatTypeToPrice.set(key, { seatTypeId, typeName, finalPrice });
                }
            }
        }
        const seatTypesWithPrices = Array.from(seatTypeToPrice.values());
        res.status(200).json(seatTypesWithPrices);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};


 export const getInfoBySeatId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const seatId = parseInt(id);
        if (isNaN(seatId)) {
            return res.status(400).json({ error: "Invalid seat ID" });
        }
        const seat = await prisma.seats.findUnique({
            where: {
                seatId: seatId,
            },
            include: {
                Seat_Types: true,
            },
        });
        if (!seat) {
            return res.status(404).json({ error: "Seat not found" });
        }
        res.status(200).json(seat);
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
};

export const getTotalSeatsRowsColumns = async (req: Request, res: Response) => {
    try {
        const { screenId } = req.params;
        const screenIdInt = parseInt(screenId);

        if (isNaN(screenIdInt)) {
            return res.status(400).json({ error: "Invalid screen ID" });
        }
        const seats = await prisma.seats.findMany({
            where: {
                screenId: screenIdInt,
            },
            select: {
                seatRow: true,
                seatNo: true,
            },
            orderBy: [
                { seatRow: 'asc' },
                { seatNo: 'asc' },
            ],
        });

        if (!seats.length) {
            return res.status(404).json({ error: "Seats not found for given screen ID" });
        }

        const totalSeats = seats.length;
        let rowSeatCounts = {}; 
        seats.forEach(seat => {
            rowSeatCounts[seat.seatRow] = (rowSeatCounts[seat.seatRow] || 0) + 1;
        });
        const rowDetails = Object.keys(rowSeatCounts).map(row => {
            return { row: row, seats: rowSeatCounts[row] };
        });

        const totalRows = rowDetails.length;

        res.status(200).json({
            totalSeats,
            totalRows,
            rowDetails 
        });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

export const getAvailableSeatIdByShowIdAndScreenId = async (req: Request, res: Response) => {
    try {
        const { showId, screenId } = req.params;
        const showIdInt = parseInt(showId);
        const screenIdInt = parseInt(screenId);

        if (isNaN(showIdInt) || isNaN(screenIdInt)) {
            return res.status(400).json({ error: "Invalid show ID or screen ID" });
        }
        const reservedSeats = await prisma.reservation_Logs.findMany({
            where: {
                showId: showIdInt,
            },
            select: {
                seatId: true,
            },
        });
        const reservedSeatsIds = reservedSeats.map(reservedSeat => reservedSeat.seatId);
        const seats = await prisma.seats.findMany({
            where: {
                screenId: screenIdInt,
                seatId: {
                    notIn: reservedSeatsIds,
                },
            },
            select: {
                seatId: true,
            },

        });
        const availableSeatsIds = seats.map(seat => seat.seatId);
        res.status(200).json(availableSeatsIds);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};
