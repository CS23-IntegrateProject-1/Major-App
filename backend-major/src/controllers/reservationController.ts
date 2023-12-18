import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const checkAvailability = async (showId: number, seatId: number) => {
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

		if (await checkAvailability(showId, seatId)) {
			const reservation = await prisma.reservation_Logs.create({
				data: {
					showId: showId,
					seatId: seatId,
				},
			});
			return res.status(201).send(reservation);
		}
	} catch (err) {
		const error = err as Error;
		res.status(500).json({ error: error.message });
	}
};
