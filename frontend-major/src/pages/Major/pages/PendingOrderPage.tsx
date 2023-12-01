import { Box, Text, Center } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import { useLocation } from "react-router-dom";
import { TypeOfSeatCard } from "../../../components/MovieSeat/TypeOfSeatCard";

function PendingOrderPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const seatTypes = queryParams.get("seatTypes")?.split(",") || [];
  const totalPrice = queryParams.get("totalPrice")?.split(",") || [];

  const uniqueSeatTypesMap = new Map(); // Using Map to store unique seat types

  // Loop through seatTypes to extract unique seat types
  seatTypes.forEach((type) => {
    const [typeName, price] = type.split(":");
    const finalPrice = price ? parseFloat(price) : 0; // Parse the price to a number

    // Check if the seat type name already exists in the Map
    if (!uniqueSeatTypesMap.has(typeName)) {
      uniqueSeatTypesMap.set(typeName, finalPrice); // Store the unique seat type with its price
    }
  });

  const uniqueSeatTypes = Array.from(uniqueSeatTypesMap.entries()); // Convert Map back to array of entries

  return (
    <Box>
      <Text color={"gold"} {...TextStyle.h1} mb={4}>
        Purchase Order
      </Text>

      {uniqueSeatTypes.map(([typeName, finalPrice], index) => (
        <TypeOfSeatCard key={index} type={{ typeName, finalPrice }} />
      ))}
      <Box>: {totalPrice}</Box>
    </Box>
  );
}

export default PendingOrderPage;
