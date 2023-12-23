import { Box, Center, Text, Image } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Axios } from "../../../AxiosInstance";
import { TextStyle } from "../../../theme/TextStyle";

const FallBackPage = () => {
  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const reservationIdParam = queryParams.get("r");
  const reservationId = useMemo(
    () => (reservationIdParam ? reservationIdParam.split(",") : []),
    [reservationIdParam]
  );
  const paymentId = useMemo(
    () => queryParams.get("p")?.split(",") || [],
    [queryParams]
  );

  useEffect(() => {
    const deletePayment = async () => {
      try {
        await Axios.delete(`/payment/delete/${reservationId}`);
        deleteReservation();
      } catch (error) {
        console.error("Error deleting payment:", error);
      }
    };

    const deleteReservation = async () => {
      try {
        await Axios.delete(`/seat/delete/${reservationId}`);
      } catch (error) {
        console.error("Error deleting reservation:", error);
      }
    };

    deletePayment();
  }, [reservationId, paymentId]);

  return (
    <Box>
      <Center>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Image
            src="../../../../movie-ticket.png"
            alt="fallbackmovieticket"
            w="50vh"
          />
          <Text color="gold" fontSize={"50px"} fontStyle={"Bold"}>
            Unfortunately...
          </Text>
          <Text color="gold" style={TextStyle.h1}>
            Your reservation has been canceled as payment was not received.
          </Text>
        </Box>
      </Center>
    </Box>
  );
};

export default FallBackPage;
