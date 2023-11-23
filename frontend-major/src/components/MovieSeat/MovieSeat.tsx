import React, { useEffect, useState,FC } from "react";
import { Box, Center, Image, Text} from "@chakra-ui/react";
import { TextStyle } from "../../theme/TextStyle";


export const MovieSeat: FC = () => {
  const [selected, setSelected] = useState(false);
const [imageSrc, setImageSrc] = useState("../../../../chair.png");
const handleImageClick = () => {
  setSelected(!selected); // Toggle the selection status

  // Change image source based on selection status
  if (selected) {
    setImageSrc("../../../../checked.png"); // Replace with the path to your selected image
  } else {
    setImageSrc("../../../../chair.png"); // Replace with the path to your default image
  }
};

  return (
    <>
    <Box>
      <Center
        style={TextStyle.h2}
        mt={10}
        mb={10}
        borderWidth="0.2vw"
        borderColor="gold"
        p={1} // Padding to make the border visible
      >
        screen
      </Center>
      <Box>
        <Image
          onClick={handleImageClick}
          style={{ cursor: "pointer" }}
          src={imageSrc}
          alt="chair"
          w="7vh"
        ></Image>
      </Box>

      <Box>
      <Center
        style={TextStyle.body1}
        mt={10}
        mb={10}
        borderWidth="0.2vw"
        borderColor="gold"
        display="flex"
        flexDirection="column"
        borderRadius="15"
        p="4"
        w="20vh"
      >
        <Image src="../../../../chair.png" alt="chair" w="7vh"></Image>
        <Text mt="2" mb="2">Type of chair</Text>
        <Text>price</Text>
      </Center>
      </Box>

      <Box display="flex" flexDirection="row" justifyContent="center">
        <Text>Seat no: </Text>
        <Text>Price: </Text>
      </Box>
    </Box>
    </>
  );
};

