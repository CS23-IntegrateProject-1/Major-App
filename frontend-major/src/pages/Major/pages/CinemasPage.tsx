import { Box, Text } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Axios } from "../../../AxiosInstance";
import { useNavigate } from "react-router-dom";
interface theater{
  theaterId: number;
  name: string;
  address: string;
  phoneNum: string;
  promptPayNum: string;
  latitude: string;
  longitude: string;
}


const CinemasPage = () => {
  const [theaterInfo, setTheaterInfo] = useState<theater[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      Axios.get(
        `http://localhost:3000/theater/getTheaters`
      ).then((response) => {
        setTheaterInfo(response.data);
      });
    } catch (error) {
      console.error("Error fetching now showing theatre:", error);
    }
  }, []);

  const handleClick = (theaterId: number) => {
    navigate(`/ShowtimeInTheater/${theaterId}`);
  }
  return (
    <>
      <Box>
        <Text color={"gold"} {...TextStyle.h1} mb={4}>
          BRANCHES
        </Text>
        <Accordion allowMultiple>
          {theaterInfo.map((theater: theater) => (
            <AccordionItem key={theater.theaterId}>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left" {...TextStyle.body1}>
                  {theater.name}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4} onClick={() => handleClick(theater.theaterId)}>
                <Text {...TextStyle.body2} pr={"6"}>
                  Address: {theater.address}
                </Text>
                <Text {...TextStyle.body2} pr={"6"}>
                  Phone: {theater.phoneNum}
                </Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </>
  );
};

export default CinemasPage;



{/* <AccordionItem>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left" {...TextStyle.body1}>
                {theaterInfo.name}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Box display="flex" flexDirection="row">
                <Text {...TextStyle.body2} pr={"6"}>
                  Major Cineplex Gateway Bang Sue
                </Text>
                <Text {...TextStyle.body2} pr={"6"} pl={"6"}>
                  Major Cineplex Central Rama |||
                </Text>
                <Text {...TextStyle.body2} pl={"6"}>
                  Major Cineplex Samsen
                </Text>
              </Box>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Bangkok: Northern
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem> */}