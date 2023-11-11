import { Box } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import { useState } from "react";

const MoviePage = () => {
  const [isHovered, setIsHovered] = useState(false);

  const linkStyles = {
    ...TextStyle.h3,
    color: isHovered ? "#d2aa5a" : "white", // Color changes on hover
    textDecoration: "none",
    transition: "color 0.3s ease",
    padding: "2vh",
  }
  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };


  return (
    <Box>
      <a
        href="/Movie"
        style={linkStyles}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        Now Showing
      </a>
    </Box>
    
  );
};

export default MoviePage;
