import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const checkAvailability = async (req: Request, res: Response) => {
	const { showId, seatId } = req.body;
	const reservation = await prisma.reservation_Logs.findMany({
		where: {
			showId: showId,
			seatId: seatId,
		},
		select: {
			showId: true,
			seatId: true,
		},
	});
	if (reservation.length > 0) {
		return res.status(200).send(false);
	}
	return res.status(200).send(true);
};

const localCheckAvailability = async (showId: number, seatId: number) => {
	const reservation = await prisma.reservation_Logs.findMany({
		where: {
			showId: showId,
			seatId: seatId,
		},
		select: {
			showId: true,
			seatId: true,
		},
	});
	if (reservation.length > 0) {
		return false;
	}
	return true;
};

export const createReservation = async (req: Request, res: Response) => {
	try {
		const { showId, seatId } = req.body;

		if (await localCheckAvailability(showId, seatId)) {
			let reservation;
			try {
				reservation = await prisma.reservation_Logs.create({
					data: {
						showId: showId,
						seatId: seatId,
					},
				});
			} catch (e) {
				console.log(e);
			}
			return res.status(201).send(reservation);
		}
		throw new Error("Seat is already booked");
	} catch (err) {
		const error = err as Error;
		res.status(500).json({ error: error.message });
	}
};

export const getReserveSeatByShowId = async (req: Request, res: Response) => {
	try {
		const showId = Number(req.body.showId);
		const data = await prisma.reservation_Logs.findMany({
			where: {
				showId: showId,
			},
		});
		res.json(data);
	} catch (err) {
		const error = err as Error;
		res.status(500).json({ error: error.message });
		console.log(err);
	}
};

export const deleteReservation = async (req: Request, res: Response) => {
	try {
		const showId = Number(req.body.showId);
		const seatId = Number(req.body.seatId);
		const data = await prisma.reservation_Logs.deleteMany({
			where: {
				showId: showId,
				seatId: seatId,
			},
		});
		res.status(200).json(data);
	} catch (e: Error | any) {
		console.log(e);
		res.status(500).json({ error: e.message });
	}
};
