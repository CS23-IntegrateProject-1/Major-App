import express, { Request, Response } from "express";
import cors from "cors";
import configureCors from "./configs/corsConfig";
import loadEnv from "./configs/dotenvConfig";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler";
import addressTracker from "./middlewares/addressTracker";
import Routes from "./routes";

loadEnv();

const app = express();

// Error handling middleware (should be placed after your routes)
app.use(errorHandler);
app.use(addressTracker);
app.use(cors(configureCors()));
app.use(express.json());
app.use(cookieParser());

const routes = new Routes(app);

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, Express with TypeScript!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
