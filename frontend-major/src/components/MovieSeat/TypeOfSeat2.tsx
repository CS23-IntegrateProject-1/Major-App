import { Box, Center, Image, Text } from "@chakra-ui/react";
import { TextStyle } from "../../theme/TextStyle";

interface Type {
  typeName: string;
}

export const TypeOfSeat2: React.FC<{ type: Type }> = ({ type }) => {
  const getSeatImage = () => {
    switch (type.typeName) {
      case "Regular":
        return <Image src="../../../../redSeat.svg" alt="red chair" w="7vh" />;
      case "Premium":
        return (
          <Image src="../../../../purpleSeat.svg" alt="purple chair" w="7vh" />
        );
      case "Honeymoon":
        return (
          <Image src="../../../../yellowSeat.svg" alt="purple chair" w="7vh" />
        );
      default:
        return <Image src="../../../../chair.png" alt="chair" w="7vh" />;
    }
  };

  return (
    <Box>
      <Center
        style={TextStyle.body1}
        mt={10}
        mb={8}
        borderWidth="0.2vw"
        borderColor="gold"
        display="flex"
        flexDirection="column"
        borderRadius="15"
        p="5"
        w="20vh"
        bg={"#2d2d2d"}
      >
        {getSeatImage()}
        <Text mt="2" mb="2">
          {type.typeName}
        </Text>
      </Center>
    </Box>
  );
};
