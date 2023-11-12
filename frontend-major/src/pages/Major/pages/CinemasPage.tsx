import { Box, Text } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

const CinemasPage = () => {
  return (
    <>
      <Box>
        <Text color={"gold"} {...TextStyle.h1} mb={4}>
          BANGKOK
        </Text>
        <Accordion>
          <AccordionItem>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left" {...TextStyle.body1}>
                Bangkok: Urban
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
          </AccordionItem>
        </Accordion>
      </Box>
    </>
  );
};

export default CinemasPage;
