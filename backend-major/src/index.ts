import express, { Request, Response } from "express";
import cors from "cors";
import configureCors from "./configs/corsConfig";
import loadEnv from "./configs/dotenvConfig";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler";
import addressTracker from "./middlewares/addressTracker";
import { deleteReservation } from "./controllers/paymentController";
import Routes from "./routes";

loadEnv();

const app = express();

// Error handling middleware (should be placed after your routes)
app.use(errorHandler);
app.use(addressTracker);
// app.use(sendTrigger);
app.use(cors(configureCors()));
app.use(express.json());
app.use(cookieParser());

new Routes(app);

const port = process.env.PORT || 3000;
app.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const event = req.body;
  
    try {
      if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object;
        const reservationId = paymentIntent.metadata.reservationId;
  
        // Delete the reservation associated with this payment failure
        await deleteReservation(reservationId); 
        }
  
      res.sendStatus(200);
    } catch (error) {
      console.error('Error handling Stripe webhook:', error);
      res.sendStatus(500);
    }
  });
  

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, Express with TypeScript!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
