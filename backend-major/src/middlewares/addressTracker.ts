import { Request, Response, NextFunction } from "express";
function addressTracker(req: Request, res: Response, next: NextFunction) {
    console.log("--------------------");
    console.log(`\tRequest ${req.method} from: ${req.ip}`);
    if (req.body && Object.keys(req.body).length != 0) {
        console.log("\tWith body:");
        console.log(req.body);
    } else {
        console.log("\tWithout body");
    }
    console.log(`\tTo: ${req.originalUrl}`);
    next();
}

export default addressTracker;
