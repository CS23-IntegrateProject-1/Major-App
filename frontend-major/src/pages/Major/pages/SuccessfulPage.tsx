import { Box, Center, Text } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import { useLocation } from "react-router-dom";
import { TypeOfSeat2 } from "../../../components/MovieSeat/TypeOfSeat2";
import QRCode from "qrcode.react";
import { useBreakpointValue } from "@chakra-ui/react";
import { Axios } from "../../../AxiosInstance";
import { useEffect, useRef, useMemo, useState } from "react";
 

const SuccessfulPage = () => {
  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const seatTypes = useMemo(() => queryParams.get("seatTypes")?.split(",") || [], [queryParams]);
  const totalPrice = useMemo(() => queryParams.get("total")?.split(",") || [], [queryParams]);
  console.log(totalPrice);

  const selectedSeat = queryParams.get("seat") || [];
  const seatId = useMemo(() => queryParams.get("no")?.split(",") || [], [queryParams]);
  const showId = useMemo(() => queryParams.get("show")?.split(",") || [], [queryParams]);
  const reservationIdRef = useRef<number | null>(null);
  const [reservationCreated, setReservationCreated] = useState(false);
  const [paymentCreated, setPaymentCreated] = useState(false);
  const uniqueSeatTypesMap = new Map<string, boolean>(); // Using Map to store unique seat types
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    const createReservation = async () => {
      if(reservationIdRef.current !== null) return; 
    try {
      const response = await Axios.post(`/seat/reserveSeatForShow/${showId}`, {
        seatId: seatId,
      });
      console.log(seatId)
      console.log(response.data);
      const createdReservationId = response.data[0].reservationId;
      reservationIdRef.current = createdReservationId; // Store the value in the useRef
      setReservationCreated(true); // Mark reservation as created
      } catch (error) {
        console.error("Error fetching now showing theatre:", error);
      }
    };
    createReservation();    
  }, [seatId, showId]);

  useEffect(() => {
    if (!paymentCreated && reservationCreated) {
      const createPayment = async (reservationId: number) => {
        try {
          console.log(reservationId);
          const payment = await Axios.post(`/payment/createPayment`, {
            reservationId: reservationId,
            paymentStatus: "success",
          });
          console.log(payment.data);
          setPaymentCreated(true); // Mark payment as created
        } catch (error) {
          console.error("Error creating payment:", error);
        }
      };
      createPayment(reservationIdRef.current || 0);
    }
  }, [reservationCreated, paymentCreated]);

  seatTypes.forEach((type) => {
    const [typeName] = type.split(":");
    if (!uniqueSeatTypesMap.has(typeName)) {
      uniqueSeatTypesMap.set(typeName, true); // Store the unique seat type with its price
    }
  });


  const uniqueSeatTypes = Array.from(uniqueSeatTypesMap.entries()); // Convert Map back to array of entries

  const qrCodeValue = `Reservation QR code ${reservationIdRef.current}`;

  const boxWidth = useBreakpointValue({ base: "90%", md: "40%", lg: "30%" });
  const boxHeight = useBreakpointValue({
    base: "40vh",
    md: "45vh",
    lg: "50vh",
  });

  return (
    <Box>
      <Text color="gold" {...TextStyle.h1} mb={4}>
        Purchase Order
      </Text>

      {uniqueSeatTypes.map(([typeName], index) => (
        <TypeOfSeat2 key={index} type={{ typeName }} />
      ))}
      <Box>
        Total Price: {totalPrice.join(", ")} Baht
      </Box>
      <Text>Selected Seat No: {selectedSeat}</Text>
      <Center {...TextStyle.h1} h={"15vh"}>
        Reservation QR code
      </Center>
      <Center>
        <Box
          p={"2%"}
          bgColor={"white"}
          borderRadius={"5%"}
          mb={"7vh"}
          width={boxWidth}
          height={boxHeight}
        >
          <QRCode
            value={qrCodeValue}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>
      </Center>

      <Center>Scan this QR code to get a ticket</Center>
      <Center>(Please take this screenshot of this QR code)</Center>
    </Box>
  );
};

export default SuccessfulPage;
