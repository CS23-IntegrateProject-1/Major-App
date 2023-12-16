import { Box, Button, Center, Text, Flex, Image } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import { useLocation, useNavigate } from "react-router-dom";
import { TypeOfSeat2 } from "../../../components/MovieSeat/TypeOfSeat2";
import QRCode from "qrcode.react";
import { useEffect, useState } from "react";
import generatePayload from "promptpay-qr";
import logo from "../../../assets/promptpay logo/PromptPay-logo.png";

function PendingOrderPage() {
  const phone = "0970437853";
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const seatTypes = queryParams.get("seatTypes")?.split(",") || [];
  const totalPrice = queryParams.get("totalPrice")?.split(",") || [];
  const [qrCode, setqrCode] = useState("sample");
  const navigate = useNavigate();
  const seatWithRow = queryParams.get("selectedSeats")?.split(",") || []; // Assuming seatIds are passed as a parameter
  //const seatIds = queryParams.get("seatIds")?.split(",") || []; // Assuming seatIds are passed as a parameter

  const uniqueSeatTypesMap = new Map(); // Using Map to store unique seat types

  // Loop through seatTypes to extract unique seat types
  seatTypes.forEach((type) => {
    const [typeName] = type.split(":");

    // Check if the seat type name already exists in the Map
    if (!uniqueSeatTypesMap.has(typeName)) {
      uniqueSeatTypesMap.set(typeName, true); // Store the unique seat type with its price
    }
  });

  const uniqueSeatTypes = Array.from(uniqueSeatTypesMap.keys()); // Get unique seat types as an array

  useEffect(() => {
    setqrCode(generatePayload(phone, { amount: parseFloat(totalPrice[0]) }));
  }, []);

  const handleConfirm = () => {
    navigate("/success");
  };

  return (
    <Box>
      <Text color="gold" {...TextStyle.h1} mb={4}>
        Purchase Order
      </Text>

      <Flex flexWrap="wrap">
        {uniqueSeatTypes.map((typeName, index) => (
          <Box key={index} mr={4} mb={4}>
            <TypeOfSeat2 type={{ typeName }} />
          </Box>
        ))}
      </Flex>

      <Text>Selected Seat: {seatWithRow.join(", ")}</Text>

      <Box>Total Price: {totalPrice.join(", ")} Baht</Box>

      <Center {...TextStyle.h1} h={"20vh"}>
        Scan to pay
      </Center>

      {qrCode === "sample" ? (
        <></>
      ) : (
        <Center m={"20px"}>
          <Box
            w={"300px"}
            overflow={"hidden"}
            bgColor={"white"}
            borderRadius={"12px"}
          >
            <Center flexDir={"column"}>
              <Image src={logo} h={"50px"}></Image>
              <QRCode value={qrCode} />
              <Box p="20px">
                <Text fontSize={"25px"} fontFamily={"inherit"} color={"black"}>
                  Miss Pavika Malipan
                </Text>
                <Text fontSize={"25px"} fontFamily={"inherit"} color={"black"}>
                  097-043-7853
                </Text>
              </Box>
            </Center>
          </Box>
        </Center>
      )}

      <Center>
        <Button
          bg="gold"
          _hover={{ bg: "gold" }}
          size="md"
          width="15rem"
          onClick={handleConfirm}
        >
          CONFIRM
        </Button>
      </Center>
    </Box>
  );
}

export default PendingOrderPage;
