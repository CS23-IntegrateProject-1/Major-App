import React, { useEffect, useState } from "react";
import { Box, Image } from "@chakra-ui/react";

interface MovieSeatProps {
  seatId: number;
  isSelected: boolean;
  onSeatClick: (seatId: number) => void; 
  type: string;
  isNotAvailable: boolean;
  //isBooked: boolean; // New prop to indicate whether the seat is booked
}

export const MovieSeat: React.FC<MovieSeatProps> = ({
  seatId,
  isSelected,
  onSeatClick,
  type,
  isNotAvailable,
}) => {
  const [selected, setSelected] = useState(isSelected);
  const getSeatImage = () => {
    if (isNotAvailable) {
      return "../../../../reserveSeat.svg";
    }
    else {
      switch (type) {
        case "Regular":
          return "../../../../redSeat.svg";
        case "Premium":
          return "../../../../purpleSeat.svg";
        case "Honeymoon":
          return "../../../../yellowSeat.svg";
        case "Reserved":
          return "../../../../reserveSeat.svg";
        default:
          return "../../../../chair.png";
      }
    }
  }
  useEffect(() => {

    setSelected(isSelected);
  }, [isSelected]);
  const imageSrc = selected ? "../../../../checked.png" : getSeatImage();

    const handleImageClick = () => {
      if(!isNotAvailable) {
        setSelected(!selected);
        onSeatClick(seatId);
      }
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
          