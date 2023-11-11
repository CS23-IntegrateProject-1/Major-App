import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import { MovieCard } from "../../../components/movieCard/moviecard";
import { NavLink } from "react-router-dom";

const MoviePage = () => {
  const [isNowShowingHovered, setIsNowShowingHovered] = useState(false);
  const [isComingSoonHovered, setIsComingSoonHovered] = useState(false);

  const linkStyles = {
    ...TextStyle.h1,
    textDecoration: "none",
    transition: "color 0.3s ease",
    padding: "2rem",
    color: "white", // Default color
  };

  const nowShowingStyles = {
    ...linkStyles,
    color: isNowShowingHovered ? "#d2aa5a" : "white",
  };

  const comingSoonStyles = {
    ...linkStyles,
    color: isComingSoonHovered ? "#d2aa5a" : "white",
  };

  const handleNowShowingMouseOver = () => {
    setIsNowShowingHovered(true);
  };

  const handleNowShowingMouseOut = () => {
    setIsNowShowingHovered(false);
  };

  const handleComingSoonMouseOver = () => {
    setIsComingSoonHovered(true);
  };

  const handleComingSoonMouseOut = () => {
    setIsComingSoonHovered(false);
  };

  return (
    <Box  justifyContent="center" textAlign="center" alignItems="center">
      <a
        href="/Movie"
        style={nowShowingStyles}
        onMouseOver={handleNowShowingMouseOver}
        onMouseOut={handleNowShowingMouseOut}
      >
            Now Showing
          </a>
          <a
            href="/ComingSoon"
            style={comingSoonStyles}
            onMouseOver={handleComingSoonMouseOver}
            onMouseOut={handleComingSoonMouseOut}
          >
            Coming Soon
          </a>
          <MovieCard />
        </Box>
  );
};

export default MoviePage;
