import { CorsOptions } from "cors";
import dotEnvConfig from "./dotenvConfig";

dotEnvConfig();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        const allowedOrigin = FRONTEND_URL;

        const isExcludedUrl = origin === process.env.EXCLUDE_URL;

        if (
            allowedOrigin === FRONTEND_URL ||
            origin === allowedOrigin ||
            isExcludedUrl
        ) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

export default function corsConfig() {
    return corsOptions;
}
