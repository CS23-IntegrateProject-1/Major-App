import { Box, Button, Center, Text, Flex, Image } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import { useLocation, useNavigate } from "react-router-dom";
import { TypeOfSeat2 } from "../../../components/MovieSeat/TypeOfSeat2";
import QRCode from "qrcode.react";
import { useEffect, useState } from "react";
import generatePayload from "promptpay-qr";
import logo from "../../../assets/promptpay logo/PromptPay-logo.png";
import { Axios } from "../../../AxiosInstance";

interface theater {
  theaterId: number;
  name: string;
  address: string;
  phoneNum: string;
  promptPayNum: string;
  latitude: string;
  longitude: string;
}

function PendingOrderPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const seatTypes = queryParams.get("seatTypes")?.split(",") || [];
  const totalPrice = queryParams.get("totalPrice")?.split(",") || [];
  const theaterId = queryParams.get("theaterId")?.split(",") || [];
  const [qrCode, setqrCode] = useState("sample");
  const navigate = useNavigate();
  const seatWithRow = queryParams.get("selectedSeats")?.split(",") || []; // Assuming seatIds are passed as a parameter
  //const seatIds = queryParams.get("seatIds")?.split(",") || []; // Assuming seatIds are passed as a parameter
  const [theaterInfo, setTheaterInfo] = useState<theater>({} as theater);
  const [promptPayNum, setPromptPayNum] = useState<string>("");
  useEffect(() => {
    const fetchTheaterInfo = async () => {
      try {
        const response = await Axios.get(`/theater/getTheaterById/${theaterId}`);
        setTheaterInfo(response.data);
        setPromptPayNum(response.data.promptPayNum);
        console.log(response.data)
        console.log(promptPayNum)
        console.log(typeof promptPayNum)
      } catch (error) {
        console.error('Error fetching theater information:', error);
      }
    };
    
    if (theaterId) {
      fetchTheaterInfo();
    }
  }, [theaterId]);
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
    if (theaterInfo && totalPrice.length > 0) {
      const phone = theaterInfo.promptPayNum || "";
      const amount = parseFloat(totalPrice[0]);
      const qrCodeData = generatePayload(phone, { amount });
      setqrCode(qrCodeData);
    }
  }, [theaterInfo, totalPrice]);

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
                  {theaterInfo.name}
                </Text>
                <Text fontSize={"25px"} fontFamily={"inherit"} color={"black"} textAlign={'center'}>
                  {promptPayNum}
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
