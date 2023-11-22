import { Box, Center, Image, Text } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";

const ScreenPage = () => {
  const posterWidth = "25vh"; // Replace with your desired movie poster width
  const posterHeight = "40vh"; // Replace with your desired movie poster height

  return (
    <>
      {/* Movie Info at top*/}
      <Box display={"flex"} flexDirection={"row"} paddingBottom={"7"}>
        <Box>
          <Image
            // src={movieInfo.posterImg}
            // alt={movieInfo.name}
            borderRadius="lg"
            width={posterWidth}
            height={posterHeight}
          />
        </Box>
        <Box display={"flex"} flexDirection={"column"} padding={"4"}>
          <Text color={"gold"} style={TextStyle.h1} mb={2}>
            Film 1
          </Text>
          <Text style={TextStyle.body1} mb={2}>
            EN | TH
          </Text>
          <Text style={TextStyle.body1} mb={2}>
            Duration minutes
          </Text>
        </Box>
      </Box>
      <Box>
        <Text style={TextStyle.body1} mb={2}>
          Theatre name
        </Text>
        <Box display="flex" flexDirection="row">
          <Center style={TextStyle.body1} mb={2} mr={20}>
            Theatre 1
          </Center>
          <Center
            style={TextStyle.body1}
            ml={20}
            backgroundColor={"gold"}
            padding="0.5%"
            borderRadius="10%"
          >
            13:00
          </Center>
        </Box>
      </Box>
      {/* Seat selected */}
    </>
  );
};

export default ScreenPage;
