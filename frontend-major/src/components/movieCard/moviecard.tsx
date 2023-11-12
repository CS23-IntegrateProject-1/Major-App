import { useState } from "react";
import { Card, Image, Button, CardFooter, CardBody } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { Box } from "@chakra-ui/react";

export const MovieCard = () => {
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
          src="https://images.squarespace-cdn.com/content/v1/5acd17597c93273e08da4786/1547847934765-ZOU5KGSHYT6UVL6O5E5J/Shrek+Poster.png"
          alt="Movie Poster"
          borderRadius="lg"
          width={posterWidth}
          height={posterHeight}
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
            <CardBody color={"white"}>Helloajfaijfiajfapof</CardBody>
            <CardFooter>
              {/* <Link to={`/movies/${movie.id}`}> */}
              <NavLink to="/MovieInfo">
                <Button
                  variant="solid"
                  color="WhiteAlpha.800"
                  size="xs"
                  width="10rem"
                >
                  MORE INFO
                </Button>
              </NavLink>
              {/* </Link> */}
            </CardFooter>
          </Card>
        )}
      </Card>
    </Box>
  );
};
