import { useEffect, useState } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import { MovieCard } from "../../../components/movieCard/moviecard";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
} from "@chakra-ui/react";
import { Axios } from "../../../AxiosInstance";


const MoviePage = () => {
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [upcommingMovies, setUpcommingMovies] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3000/film/getCurrentFilm")
      .then((response) => {
        setNowShowingMovies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching now showing movies:", error);
      });
  }, []);
  useEffect(() => {
    Axios.get("http://localhost:3000/film/getUpcomingFilm")
      .then((response) => {
        setUpcommingMovies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching now showing movies:", error);
      });
  }, []);

  return (
    <Box justifyContent="center" textAlign="center" alignItems="center">
      {/* Tab details and show */}
      <Tabs isFitted position="relative" variant="unstyled">
        <TabList>
          <Tab _selected={{ color: "gold" }}>Now Showing</Tab>
          <Tab _selected={{ color: "gold" }}>Upcoming</Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="gold" borderRadius="1px" />
        <TabPanels>
          <TabPanel>
            <Flex flexWrap="wrap" justifyContent="center" >
              {nowShowingMovies.map((film, index) => {
              const isNewRow = index % 4 === 0;
              // Calculate whether the film is the last in its row (4th, 8th, 12th, etc.)
              const isEndOfRow = (index + 1) % 4 === 0 || index === nowShowingMovies.length - 1;

              // Apply left margin to all except the first in a row, right margin to all except the last in a row
              const marginX = { marginLeft: isNewRow ? 0 : 2, marginRight: isEndOfRow ? 0 : 2 };

              return (
                <Box 
                  key={film} // Assuming 'film' is an object with an 'id' field
                  flex="1 0 21%" // Adjust this value to control the width of the card
                  justifyContent="center"
                  {...marginX}
                  marginBottom={4} // Adjust this value to control the vertical spacing between rows
                >
                  <MovieCard film={film} />
                </Box>
              )
            })}
          </Flex>

          </TabPanel>
          <TabPanel>
            <Flex flexWrap="wrap" justifyContent="initial">
              {upcommingMovies.map((film) => (
                <MovieCard key={film} film={film} />
              ))}
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MoviePage;
