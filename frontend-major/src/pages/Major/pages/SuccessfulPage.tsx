import { Box, Center, Text } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import { useLocation } from "react-router-dom";
import { TypeOfSeat2 } from "../../../components/MovieSeat/TypeOfSeat2";
import QRCode from "qrcode.react";
import { useBreakpointValue } from "@chakra-ui/react";

// const reservationId = "YourReservationID";

const SuccessfulPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const seatTypes = queryParams.get("seatTypes")?.split(",") || [];
  const totalPrice = queryParams.get("totalPrice")?.split(",") || [];
  const reservationId = queryParams.get("reserve") || [];
  const total = queryParams.get("total") || [];
  const selectedSeat = queryParams.get("selectedSeats") || [];

  const uniqueSeatTypesMap = new Map<string, boolean>(); // Using Map to store unique seat types

  // Loop through seatTypes to extract unique seat types
  seatTypes.forEach((type) => {
    const [typeName] = type.split(":");

    // Check if the seat type name already exists in the Map
    if (!uniqueSeatTypesMap.has(typeName)) {
      uniqueSeatTypesMap.set(typeName, true); // Store the unique seat type with its price
    }
  });

  const uniqueSeatTypes = Array.from(uniqueSeatTypesMap.entries()); // Convert Map back to array of entries

  const qrCodeValue = `Reservation QR code ${reservationId}`;

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
        Total Price: {totalPrice.join(", ")} {total} Baht
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
