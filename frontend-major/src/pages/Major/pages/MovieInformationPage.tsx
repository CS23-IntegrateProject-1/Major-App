import { Box, Text, Image } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";

const MovieInformationPage = () => {
  const posterWidth = "150px"; // Replace with your desired movie poster width
  const posterHeight = "225px"; // Replace with your desired movie poster height

  return (
    <Box>
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
          <Text color={"gold"} {...TextStyle.body1} mb={2}>
            Movie date
          </Text>
          <Text {...TextStyle.h1} mb={2}>
            Movie name
          </Text>
          <Text {...TextStyle.body1} mb={2}>
            Movie Type
          </Text>
          <Text {...TextStyle.body1} mb={2}>
            Movie duration
          </Text>
        </Box>
      </Box>
      <hr />
      <Text {...TextStyle.h1} mt={2} mb={2}>
        Synopsis
      </Text>
      <Text {...TextStyle.body1} mt={2} mb={2} noOfLines={[1, 2, 3]}>
        Synopsis details
      </Text>
    </Box>
  );
};

export default MovieInformationPage;
