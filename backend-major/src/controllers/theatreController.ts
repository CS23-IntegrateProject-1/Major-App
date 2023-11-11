import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
export const getTheaters = async (req: Request, res: Response) => {
    try{
        const theatre = await prisma.theaters.findMany();
        if(!theatre){
            return res.status(404).json({error: "Theater not found"});
        }
        res.status(200).json({theatre});
    } catch (err) {
        const error = err as Error;
        res.status(500).json({error: error.message});
    }
};

export const getTheaterById = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const theaterId = parseInt(id);
        if(isNaN(theaterId)){
            return res.status(400).json({error: "Invalid theater ID"});
        }
        const theater = await prisma.theaters.findUnique({
            where: {
                theaterId: theaterId
            }
        });
        if(!theater){
            return res.status(404).json({error: "Theater not found"});
        }
        res.status(200).json({theater});
    } catch (err) {
        const error = err as Error;
        res.status(500).json({error: error.message});
    }
};