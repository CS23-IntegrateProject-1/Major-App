import { Box, Button, Center, Text } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import { useLocation } from "react-router-dom";
import { TypeOfSeat2 } from "../../../components/MovieSeat/TypeOfSeat2";

const SuccessfulPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const seatTypes = queryParams.get("seatTypes")?.split(",") || [];
  const totalPrice = queryParams.get("totalPrice")?.split(",") || [];

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
  return (
    <Box>
      <Text color="gold" {...TextStyle.h1} mb={4}>
        Purchase Order
      </Text>

      {uniqueSeatTypes.map(([typeName], index) => (
        <TypeOfSeat2 key={index} type={{ typeName }} />
      ))}
      <Box>Total Price: {totalPrice.join(", ")}</Box>
      <Text>Selected Seat No:</Text>
      <Center {...TextStyle.h1} h={"20vh"}>
        Reservation ID:
      </Center>
      <Center>
        Scan this QR code to get a ticket <br />
        (Please take this screenshot of this QR code)
      </Center>
    </Box>
  );
};

export default SuccessfulPage;