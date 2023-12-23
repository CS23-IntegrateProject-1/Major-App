import { Box, Center, Text } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import { useLocation } from "react-router-dom";
import { TypeOfSeat2 } from "../../../components/MovieSeat/TypeOfSeat2";
import QRCode from "qrcode.react";
import { useBreakpointValue } from "@chakra-ui/react";
import { Axios } from "../../../AxiosInstance";
import { useEffect, useMemo, useState } from "react";

const SuccessfulPage = () => {
  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const seatTypes = useMemo(
    () => queryParams.get("seatTypes")?.split(",") || [],
    [queryParams]
  );
  const totalPrice = useMemo(
    () => queryParams.get("total")?.split(",") || [],
    [queryParams]
  );

  const reservationIdParam = queryParams.get("r");
  const reservationId = useMemo(
    () => (reservationIdParam ? reservationIdParam.split(",") : []),
    [reservationIdParam]
  );

  const selectedSeat = queryParams.get("seat") || [];
  const uniqueSeatTypesMap = new Map<string, boolean>(); // Using Map to store unique seat types
  const [hashedReserve, setHashedReserve] = useState<string>("");

  useEffect(() => {
    const updatePayment = async () => {
      try {
        await Axios.put(`/payment/updatePayment/`, {
          reservationId: reservationId,
          paymentStatus: "success",
        });
      } catch (error) {
        console.error("Error updating payment:", error);
      }
    };
    updatePayment();
  }, [reservationId]);

  useEffect(() => {
    if (reservationId.length === 0) {
      return;
    }
    const getHashedReserve = async () => {
      try {
        const response = await Axios.get(
          `/seat/getHashedReserve/${reservationId[0]}`
        );
        setHashedReserve(response.data.hashedReserveId);
      } catch (error) {
        console.error("Error fetching hashed reserve:", error);
      }
    };
    getHashedReserve();
  });

  seatTypes.forEach((type) => {
    const [typeName] = type.split(":");
    if (!uniqueSeatTypesMap.has(typeName)) {
      uniqueSeatTypesMap.set(typeName, true); // Store the unique seat type with its price
    }
  });

  const uniqueSeatTypes = Array.from(uniqueSeatTypesMap.entries()); // Convert Map back to array of entries

  const qrCodeValue = `Reservation QR code ${hashedReserve}`;

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
      <Box>Total Price: {totalPrice.join(", ")} Baht</Box>
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
