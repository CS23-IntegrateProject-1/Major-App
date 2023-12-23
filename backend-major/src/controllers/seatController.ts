import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const getAllSeats = async (req: Request, res: Response) => {
  try {
    const seats = await prisma.seats.findMany();
    res.status(200).json(seats);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getSeatByScreenIdAndShowId = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, showid } = req.params;
    const screenId = parseInt(id);
    const showId = parseInt(showid);

    if (isNaN(screenId) || isNaN(showId)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const screen = await prisma.screens.findUnique({
      where: {
        screenId: screenId,
      },
      select: {
        price: true,
      },
    });

    const seats = await prisma.seats.findMany({
      where: {
        screenId: screenId,
      },
      include: {
        Seat_Types: true,
      },
    });

    if (!seats.length || !screen) {
      return res.status(404).json({ error: "Not found" });
    }
    const defaultPrice = 0;
    const seatsWithCalculatedPrices = seats.map((seat) => {
      const screenPrice =
        screen.price !== null
          ? parseFloat(screen.price.toString())
          : defaultPrice;
      const finalPrice =
        screenPrice * parseFloat(seat.Seat_Types.price_modifier.toString());
      return {
        ...seat,
        finalPrice: finalPrice,
      };
    });
    res.status(200).json(seatsWithCalculatedPrices);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getUniqueSeatTypeByScreenId = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, showid } = req.params;
    const screenId = parseInt(id);
    const showId = parseInt(showid);
    console.log(showId);
    const screen = await prisma.screens.findUnique({
      where: {
        screenId: screenId,
      },
      select: {
        price: true,
      },
    });
    if (!screen) {
      return res.status(404).json({ error: "Screen not found" });
    }
    const seats = await prisma.seats.findMany({
      where: {
        screenId: screenId,
      },
      include: {
        Seat_Types: {
          select: {
            seatTypeId: true,
            typeName: true,
            price_modifier: true,
          },
        },
      },
    });
    if (!seats) {
      return res.status(404).json({ error: "Seats not found" });
    }
    const seatTypeToPrice = new Map();
    for (const seat of seats) {
      const { seatTypeId, typeName, price_modifier } = seat.Seat_Types;
      const screenPrice = screen?.price ?? 0;
      const finalPrice =
        parseFloat(screenPrice.toString()) *
        parseFloat(price_modifier.toString());
      const key = `${seatTypeId}-${typeName}`;
      if (
        !seatTypeToPrice.has(key) ||
        seatTypeToPrice.get(key).finalPrice !== finalPrice
      ) {
        seatTypeToPrice.set(key, { seatTypeId, typeName, finalPrice });
      }
    }
    const seatTypesWithPrices = Array.from(seatTypeToPrice.values());
    res.status(200).json(seatTypesWithPrices);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getInfoBySeatId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const seatId = parseInt(id);
    if (isNaN(seatId)) {
      return res.status(400).json({ error: "Invalid seat ID" });
    }
    const seat = await prisma.seats.findUnique({
      where: {
        seatId: seatId,
      },
      include: {
        Seat_Types: true,
      },
    });
    if (!seat) {
      return res.status(404).json({ error: "Seat not found" });
    }
    res.status(200).json(seat);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const reserveSeatForShow = async (req: Request, res: Response) => {
  try {
    const { showId } = req.params;
    const { seatId } = req.body;
    const showIdNum = parseInt(showId);
    const seatIdArray = seatId.split(",").map((id) => parseInt(id));

    //console.log("Show ID:", showIdNum);
    //console.log("Seat IDs:", seatIdArray);

    const existingReservations = await prisma.reservation_Logs.findFirst({
      where: {
        showId: showIdNum,
        seatId: { in: seatIdArray },
      },
      select: {
        reservationId: true,
        seatId: true,
        showId: true,
      },
    });

    //console.log("Existing reservation:", existingReservations);

    if (existingReservations != undefined) {
      //console.log("Exist");
      const reservationId = existingReservations.reservationId; // Extracting reservationId
      return res.status(200).json([reservationId]); // Returning only reservationId
    }

    const reservations = await Promise.all(
      seatIdArray.map((seatIdNum) => {
        return prisma.reservation_Logs.create({
          data: {
            showId: showIdNum,
            seatId: seatIdNum,
          },
        });
      })
    );

    const reservationIds = reservations.map((reservation) => reservation.reservationId); // Extracting reservationIds

    //console.log("New reservations:", reservations);
    //console.log("New reservation IDs:", reservationIds);

    res.status(200).json(reservationIds); // Returning only reservationIds
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};



export const deleteReservation = async (req: Request, res: Response) => {
  try {
     const { reservationId } = req.params;
     const reserationArr = reservationId.split(",");
      //(reserationArr);
      const reservation = await Promise.all(
        reserationArr.map((reservationIdNum) => {
          return prisma.reservation_Logs.delete({
            where: {
              reservationId: parseInt(reservationIdNum),
            },
          });
        })
      );

      res.status(200).json({ data: reservation });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

export const getHashedReserveId = async (req: Request, res: Response) => {
    try{
        const {reserve} = req.params;
        //console.log(reserve)
        const reserveId = parseInt(reserve);
        const hashedReserveId = jwt.sign({reserveId}, process.env.JWT_SECRET_KEY ?? "");
        res.status(200).json({hashedReserveId});
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
}

export const getTotalSeatsRowsColumns = async (req: Request, res: Response) => {
  try {
    const { screenId } = req.params;
    const screenIdInt = parseInt(screenId);

    if (isNaN(screenIdInt)) {
      return res.status(400).json({ error: "Invalid screen ID" });
    }
    const seats = await prisma.seats.findMany({
      where: {
        screenId: screenIdInt,
      },
      select: {
        seatRow: true,
        seatNo: true,
      },
      orderBy: [{ seatRow: "asc" }, { seatNo: "asc" }],
    });

    if (!seats.length) {
      return res
        .status(404)
        .json({ error: "Seats not found for given screen ID" });
    }

    const totalSeats = seats.length;
    const rowSeatCounts = {};
    seats.forEach((seat) => {
      rowSeatCounts[seat.seatRow] = (rowSeatCounts[seat.seatRow] || 0) + 1;
    });
    const rowDetails = Object.keys(rowSeatCounts).map((row) => {
      return { row: row, seats: rowSeatCounts[row] };
    });

    const totalRows = rowDetails.length;

    res.status(200).json({
      totalSeats,
      totalRows,
      rowDetails,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getAvailableSeatIdByShowIdAndScreenId = async (
  req: Request,
  res: Response
) => {
  try {
    const { showId, screenId } = req.params;
    const showIdInt = parseInt(showId);
    const screenIdInt = parseInt(screenId);

    if (isNaN(showIdInt) || isNaN(screenIdInt)) {
      return res.status(400).json({ error: "Invalid show ID or screen ID" });
    }
    const reservedSeats = await prisma.reservation_Logs.findMany({
      where: {
        showId: showIdInt,
      },
      select: {
        seatId: true,
      },
    });
    const reservedSeatsIds = reservedSeats.map(
      (reservedSeat) => reservedSeat.seatId
    );
    const seats = await prisma.seats.findMany({
      where: {
        screenId: screenIdInt,
        seatId: {
          notIn: reservedSeatsIds,
        },
      },
      select: {
        seatId: true,
      },
    });
    const availableSeatsIds = seats.map((seat) => seat.seatId);
    res.status(200).json(availableSeatsIds);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getAllSeatType = async (req: Request, res: Response) => {
  try {
    const seatTypes = await prisma.seat_Types.findMany();
    res.status(200).json(seatTypes);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const addWaitingLog = async (req: Request, res: Response) => {
  try {
    const { showId, seatId } = req.body;
    console.log(showId)
    console.log(seatId)
      const now = new Date();
      const seatIdArray = seatId.split(",").map((id) => parseInt(id));
      const findWaitingLog = await prisma.waiting_Logs.findMany({
      where: {
          showId: parseInt(showId),
          seatId: { in: seatIdArray },
          startTime: {
            gt: new Date(new Date().getTime() - 30 * 60000), 
          }
      },
      select: {
          showId: true,
          seatId: true,
      },
      });
      if (findWaitingLog.length > 0) {
        return res.status(200).send(false);
      }
      const waitingLog = await Promise.all(
      seatIdArray.map((seatIdNum) => {
          return prisma.waiting_Logs.create({
          data: {
              showId: parseInt(showId),
              seatId: seatIdNum,
              startTime: now,
          },
          });
      })
      );
      res.status(200).json(waitingLog);
  } catch (err) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
  }
}


export const reserveSeatForShow = async (req: Request, res: Response) => {
try {
  const { showId } = req.params;
  const { seatId } = req.body;
  const showIdNum = parseInt(showId);
  const seatIdArray = seatId.map((id) => parseInt(id));
  console.log("Show ID:", showIdNum);
  console.log("Seat IDs:", seatIdArray);

  const existingReservations = await prisma.reservation_Logs.findFirst({
    where: {
      showId: showIdNum,
      seatId: { in: seatIdArray },
    },
    select: {
      reservationId: true,
      seatId: true,
      showId: true,
    },
  });

  console.log("Existing reservation:", existingReservations);

  if (existingReservations != undefined) {
    console.log("Exist");
    return res.status(200).json([existingReservations]);
  }
  const reservations = await Promise.all(
    seatIdArray.map((seatIdNum) => {
      return prisma.reservation_Logs.create({
        data: {
          showId: showIdNum,
          seatId: seatIdNum,
        },
      });
    })
  );
  console.log(reservations);

  res.status(200).json(reservations);
} catch (err) {
  const error = err as Error;
  res.status(500).json({ error: error.message });
}
}