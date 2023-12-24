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
    const reserveArray = reservationId.split(",");
    const now = new Date();

    const payments = await Promise.all(
      reserveArray.map((reservationIdNum) => {
        return prisma.payments.create({
          data: {
            reservationId: parseInt(reservationIdNum),
            paymentDate: now,
            paymentStatus: paymentStatus,
          },
        });
      })
    );

    const paymentIds = payments.map((payment) => payment.paymentId); // Extracting paymentIds

    res.status(201).json(paymentIds); // Returning only paymentIds in an array
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const YOUR_DOMAIN = process.env.FRONTEND_URL ?? "";

export const createPaymentSession = async (req: Request, res: Response) => {
  try {
    const { totalPrice, selectSeat, seatId, showId, reservationId } =
      req.body;
    //console.log(reservationId);
    //console.log(paymentId);
    const sessionTimeout = Math.floor(Date.now() / 1000) + 60;

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
      success_url: `${YOUR_DOMAIN}/success?total=${totalPrice}&seat=${selectSeat}&no=${seatId}&show=${showId}&r=${reservationId}`,
      cancel_url: `${YOUR_DOMAIN}/fallback?r=${reservationId}`,
      metadata: {
        sessionTimeout: sessionTimeout,
      },
    });

    //console.log(session.url);
    res.status(201).json({ url: session.url });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  try {
    const { reservationId, paymentStatus } = req.body;
    //console.log(reservationId);
    const reserveArray = reservationId.map((id) => parseInt(id));
    const payments = await prisma.payments.updateMany({
      where: {
        reservationId: {
          in: reserveArray,
        },
      },
      data: {
        paymentStatus: paymentStatus,
      },
    });

    res.status(200).json({ data: payments });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.params;

    const payment = await prisma.payments.deleteMany({
      where: {
        reservationId: {
          in: reservationId.split(",").map((id) => parseInt(id)),
        },
      },
    });

    res.status(200).json({ data: payment });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};
