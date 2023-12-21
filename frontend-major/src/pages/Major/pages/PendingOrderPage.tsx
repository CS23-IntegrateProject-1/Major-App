// import { Box, Button, Center, Text, Flex, Image } from "@chakra-ui/react";
import { Box, Button, Center, Text, Flex, Image } from "@chakra-ui/react";
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
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY ?? "");

function PendingOrderPage() {
  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const seatTypes = queryParams.get("seatTypes")?.split(",") || [];
  const seatId = queryParams.get("seatIds")?.split(",") || [];
  const showId = queryParams.get("showid")?.split(",") || [];
  const totalPrice = useMemo(
    () => queryParams.get("totalPrice")?.split(",") || [],
    [queryParams]
  );

  const seatWithRow = queryParams.get("selectedSeats")?.split(",") || []; // Assuming seatIds are passed as a parameter

  const [theaterInfo, setTheaterInfo] = useState<theater>({} as theater);

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
  }, [queryParams]); // Include theaterInfo in the dependency array

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
        showId: showId,
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

  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  return (
    <Box>
      <Text color="gold" {...TextStyle.h1}>
        Purchase Order
      </Text>
      <Box>
        <Flex flexWrap="wrap">
          {uniqueSeatTypes.map((typeName, index) => (
            <Box key={index} mr={4}>
              <TypeOfSeat2 type={{ typeName }} />
            </Box>
          ))}
        </Flex>
        <Box flexDir={"column"}>
          <Text>{theaterInfo.name}</Text>
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
            h={{ base: "18vh", sm: "18vh", md: "18vh", lg: "30vh" }}
            w={{ base: "20vh", sm: "20vh", md: "20vh", lg: "30vh" }}
            mb={10}
            borderWidth="0.2vw"
            borderColor="white"
            display="flex"
            flexDirection="column"
            borderRadius="15"
            p="4"
            bg={"#2d2d2d"}
            _hover={{
              boxShadow: "0 0 15px gold",
              transition: "box-shadow 0.3s ease-in-out, color 0.3s ease-in-out", // Adding transitions for both text and box-shadow
            }}
            transition="box-shadow 0.2s ease-in-out" // Adding transition for smooth effect
            onMouseOver={handleHover}
            onMouseOut={handleMouseOut}
          >
            <Image
              src={
                isHovered
                  ? "../../../../creditcardG.png"
                  : "../../../../creditcardW.png"
              }
              alt="creditcard"
              w="11vh"
              transition="0.3s ease-in-out" // Adding transition for the image
            />
            <Text
              mt="2"
              mb="1"
              fontSize={"xl"}
              color={isHovered ? "gold" : "white"}
              transition="color 0.05s ease-in-out" // Adding transition for the text color
            >
              Credit/Debit
            </Text>
          </Button>
        </Center>
      </Box>
    </Box>
  );
}

export default PendingOrderPage;
