import React, { useEffect, useState, FC } from "react";
import { Box, Center, Image, Text } from "@chakra-ui/react";
import { TextStyle } from "../../theme/TextStyle";

export const MovieSeat: FC = () => {
  const [selected, setSelected] = useState(false);
  const [imageSrc, setImageSrc] = useState("../../../../redSeat.svg");
  const handleImageClick = () => {
    setSelected(!selected); // Toggle the selection status

    // Change image source based on selection status
    if (selected) {
      setImageSrc("../../../../checked.png"); // Replace with the path to your selected image
    } else {
      setImageSrc("../../../../redSeat.svg"); // Replace with the path to your default image
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
      </Box>
    </>
  );
};
