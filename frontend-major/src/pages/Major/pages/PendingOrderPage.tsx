// import { Box, Button, Center, Text, Flex, Image } from "@chakra-ui/react";
import { Box, Button, Center, Text, Flex } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import { useLocation } from "react-router-dom";
import { TypeOfSeat2 } from "../../../components/MovieSeat/TypeOfSeat2";
import { useEffect, useState, useMemo } from "react";
import { Axios } from "../../../AxiosInstance";
import { loadStripe } from "@stripe/stripe-js";

interface theater {
  theaterId: number;
  name: string;
  address: string;
  phoneNum: string;
  promptPayNum: string;
  latitude: string;
  longitude: string;
}
const stripePromise = loadStripe(
  "pk_test_51OOyo2JnAxcvlB9ihjdMfNhFwNjRCmNlpFHo46RQeW7WZrx0EZ3nuLKvgBVziNiW6hkFAy6uVk1rwrMchN27p7CO00eV2YBL0b"
);

function PendingOrderPage() {
  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const seatTypes = queryParams.get("seatTypes")?.split(",") || [];
  const seatId = queryParams.get("seatIds")?.split(",") || [];
  const totalPrice = useMemo(
    () => queryParams.get("totalPrice")?.split(",") || [],
    [queryParams]
  );
  //const theaterId = queryParams.get("theaterId")?.split(",") || [];
  // const showId = queryParams.get("showid")?.split(",") || [];
  // // const [qrCode, setqrCode] = useState("sample");
  // const seatIds = queryParams.get("seatIds") || [];

  const seatWithRow = queryParams.get("selectedSeats")?.split(",") || []; // Assuming seatIds are passed as a parameter
  //const seatIds = queryParams.get("seatIds")?.split(",") || []; // Assuming seatIds are passed as a parameter
  const [theaterInfo, setTheaterInfo] = useState<theater>({} as theater);
  //const [promptPayNum, setPromptPayNum] = useState<string>("");

  useEffect(() => {
    const fetchTheaterInfo = async () => {
      try {
        const fetchedTheaterId = queryParams.get("theaterId")?.split(",") || [];
        const response = await Axios.get(
          `/theater/getTheaterById/${fetchedTheaterId}`
        );
        setTheaterInfo(response.data);
        // setPromptPayNum(response.data.promptPayNum);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching theater information:", error);
      }
    };

    fetchTheaterInfo();
  }, [queryParams, theaterInfo]); // Include theaterInfo in the dependency array

  const uniqueSeatTypesMap = new Map();
  seatTypes.forEach((type) => {
    const [typeName] = type.split(":");
    if (!uniqueSeatTypesMap.has(typeName)) {
      uniqueSeatTypesMap.set(typeName, true);
    }
  });

  const uniqueSeatTypes = Array.from(uniqueSeatTypesMap.keys()); // Get unique seat types as an array

  const createPaymentSession = async () => {
    try {
      const response = await Axios.post(`/payment/createPaymentSession`, {
        totalPrice: parseFloat(totalPrice[0]) || 0,
        selectSeat: seatWithRow.join(", "),
        seatId: seatId,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error creating payment session:", error);
    }
  };

  const handlePayment = async () => {
    const stripe = await stripePromise;
    if (stripe) {
      createPaymentSession();
    }
  };

  return (
    <Box>
      <Text color="gold" {...TextStyle.h1}>
        Purchase Order
      </Text>
      <Box>
        <Flex flexWrap="wrap">
          {uniqueSeatTypes.map((typeName, index) => (
            <Box key={index} mr={4} mb={5}>
              <TypeOfSeat2 type={{ typeName }} />
            </Box>
          ))}
        </Flex>
        <Box flexDir={"column"}>
          <Text mb={1}>Selected Seat: {seatWithRow.join(", ")}</Text>
          <Text>Total Price: {totalPrice.join(", ")} Baht</Text>
        </Box>
      </Box>
      <Center {...TextStyle.h1} h={"10vh"}>
        Payment
      </Center>

      <Box>
        {/* Your previous JSX code here */}

        <Center m={"20px"}>
          <Button
            onClick={handlePayment}
            bg="gold"
            _hover={{ bg: "gold" }}
            size="md"
            width="15rem"
          >
            PAY NOW
          </Button>
        </Center>
      </Box>
    </Box>
  );
}

export default PendingOrderPage;
