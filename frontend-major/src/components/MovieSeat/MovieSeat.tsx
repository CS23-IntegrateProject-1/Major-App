import React, { useEffect, useState } from "react";
import { Box, Image } from "@chakra-ui/react";

interface MovieSeatProps {
  seatId: number;
  isSelected: boolean;
  onSeatClick: (seatId: number) => void; 
  type: string;
}

export const MovieSeat: React.FC<MovieSeatProps> = ({
  seatId,
  isSelected,
  onSeatClick,
  type
}) => {
  const [selected, setSelected] = useState(isSelected);
  const getSeatImage = () => {
    switch (type) {
      case "Regular":
        return "../../../../redSeat.svg";
      case "Premium":
        return "../../../../purpleSeat.svg";
      case "Honeymoon":
        return "../../../../yellowSeat.svg";
      default:
        return "../../../../chair.png";
    }
  };

  useEffect(() => {

    setSelected(isSelected);
  }, [isSelected]);
  const imageSrc = selected ? "../../../../checked.png" : getSeatImage();

    const handleImageClick = () => {
      onSeatClick(seatId);
      setSelected(!selected); 
    };

    return (
      <Box>
        <Box>
          <Image
            onClick={handleImageClick}
            style={{ cursor: "pointer" }}
            src={imageSrc} 
            alt="chair"
            w="7vh"
          />
        </Box>
      </Box>
    );
  };
          