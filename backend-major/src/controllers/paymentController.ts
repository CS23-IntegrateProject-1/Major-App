import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient(); 
export const createPayment = async (req: Request, res: Response) => {
    try {
        const {reservationId, paymentStatus} = req.body;
        const now = new Date();
        const payment = await prisma.payments.create({
            data: {
                reservationId: reservationId,
                paymentDate: now,
                paymentStatus: paymentStatus,

            },
        });
        res.status(201).json({ data: payment });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
}

export const updatePayment = async (req: Request, res: Response) => {
    try{
        const {reservationId, paymentId} = req.body;
        const payment = await prisma.payments.update({
            where: {
                paymentId: parseInt(paymentId),
                reservationId: parseInt(reservationId),
            },
            data: {
                paymentStatus: "success",
            },
        });
        res.status(200).json({ data: payment });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};
