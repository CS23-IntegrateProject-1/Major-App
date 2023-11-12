import { Box, Text, Image, Button } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
} from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

const MovieInformationPage = () => {
  const posterWidth = "150px"; // Replace with your desired movie poster width
  const posterHeight = "225px"; // Replace with your desired movie poster height

  const buttonWidth = "200px";
  const buttonHeight = "100px";

  return (
    <Box>
      {/* Movie Info at top*/}
      <Box display={"flex"} flexDirection={"row"} paddingBottom={"7"}>
        <Box>
          <Image
            src="https://images.squarespace-cdn.com/content/v1/5acd17597c93273e08da4786/1547847934765-ZOU5KGSHYT6UVL6O5E5J/Shrek+Poster.png"
            alt="Movie Poster"
            borderRadius="lg"
            width={posterWidth}
            height={posterHeight}
          />
        </Box>
        <Box display={"flex"} flexDirection={"column"} padding={"4"}>
          <Text color={"gold"} {...TextStyle.body2} mb={2}>
            Movie date
          </Text>
          <Text {...TextStyle.h1} mb={2}>
            Movie name
          </Text>
          <Text {...TextStyle.body2} mb={2}>
            Movie Type
          </Text>
          <Text {...TextStyle.body2} mb={2}>
            Movie duration
          </Text>
        </Box>
      </Box>

      {/* Tab details and show */}
      <Tabs isFitted position="relative" variant="unstyled">
        <TabList>
          <Tab _selected={{ color: "gold" }}>Details</Tab>
          <Tab _selected={{ color: "gold" }}>Show</Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="gold" borderRadius="1px" />
        <TabPanels>
          {/* Details */}
          <TabPanel>
            <Text {...TextStyle.h2} mt={2} mb={2}>
              Synopsis
            </Text>
            <Text {...TextStyle.body2} mt={2} mb={2} noOfLines={[1, 2, 3]}>
              Synopsis details
            </Text>
          </TabPanel>

          {/* Show (โรง+รอบหนัง) */}
          <TabPanel>
            <Text {...TextStyle.h2} mt={2} mb={2}>
              Date swipe{" "}
            </Text>
            {/* Show (โรง+รอบหนัง) slide ลงมา */}
            <Accordion defaultIndex={[0]} allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <Text {...TextStyle.h2}>Theatre name 1 </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} {...TextStyle.body2}>
                  <Text mb={"2"}>Theatre 1 | EN </Text>
                  <Box display={"flex"} flexDirection={"row" } >
                    <Button  mr={"4"}> 13:00 </Button>
                    <Button mr={"4"}> 16:00 </Button>
                    <Button mr={"4"}> 19:00 </Button>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MovieInformationPage;
