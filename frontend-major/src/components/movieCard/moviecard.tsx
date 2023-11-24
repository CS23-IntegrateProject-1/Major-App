import { useState } from "react";
import { Card, Image, Button, CardFooter, CardBody } from "@chakra-ui/react";
import {  Link } from "react-router-dom";
import { Box } from "@chakra-ui/react";

interface film {
  filmId: number; // Replace 'number' with the actual type of filmId
  name: string; // Replace 'string' with the actual type of title
  posterImg: string; // Replace 'string' with the actual type of posterUrl
  // Add other properties as needed
}

export const MovieCard: React.FC<{ film: film }> = ({ film }) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  const posterWidth = "200px"; // Replace with your desired movie poster width
  const posterHeight = "300px"; // Replace with your desired movie poster height
  
  
  return (
    <Box>
      <Card
        maxW={posterWidth}
        maxH={posterHeight}
        align="center"
        position="relative"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        m={4}
      >
        <Image
          src={film.posterImg}
          alt="Movie Poster"
          borderRadius="lg"
          width={posterWidth}
          height={posterHeight}
          style={{borderRadius:"6px"}}
          
        />
        {isHovered && (
          <Card
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            bg="rgba(0, 0, 0, 0.67)"
            transition="color 0.3s ease"
          >
            <CardBody color={"white"}>{film.name}</CardBody>
            <CardFooter>
              <Link to={`/MovieInfo/${+film.filmId}`}>
              {/* <NavLink to = "/MovieInfo/{film.filmId}`"> */}
              {/* // {`/film/${film.filmId}`} */}
                <Button
                  variant="solid"
                  color="WhiteAlpha.800"
                  size="xs"
                  width="10rem"
                >
                  MORE INFO
                </Button>
              {/* </NavLink> */}
              </Link>
            </CardFooter>
          </Card>
        )}
      </Card>
    </Box>
  );
};
