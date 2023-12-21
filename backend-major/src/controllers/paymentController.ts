import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Stripe from "stripe";

const prisma = new PrismaClient();
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payments.findMany();
    res.status(200).json(payments);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { reservationId, paymentStatus } = req.body;
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
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const YOUR_DOMAIN = process.env.FRONTEND_URL ?? "";

export const createPaymentSession = async (req: Request, res: Response) => {
  try {
    const { totalPrice, selectSeat, seatId, showId } = req.body; // Assuming the frontend sends the totalPrice

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: {
              name: "Movie Ticket",
            },
            unit_amount: totalPrice * 100, 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success?total=${totalPrice}&seat=${selectSeat}&no=${seatId}&show=${showId}`,
      cancel_url: `${YOUR_DOMAIN}`,
    });

    console.log(session.url);
    res.status(201).json({ url: session.url });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

// export const getPaymentById = async (req: Request, res: Response) => {

// }

export const updatePayment = async (req: Request, res: Response) => {
  try {
    const { reservationId, paymentId } = req.body;
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
