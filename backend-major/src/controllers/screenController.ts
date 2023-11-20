import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getScreenInfoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const screenId = parseInt(id);
        if (isNaN(screenId)) {
        return res.status(400).json({ error: "Invalid screen ID" });
        }
        const screen = await prisma.screens.findUnique({
        where: {
            screenId: screenId,
        },
        });
        if (!screen) {
        return res.status(404).json({ error: "Screen not found" });
        }
        res.status(200).json(screen);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};