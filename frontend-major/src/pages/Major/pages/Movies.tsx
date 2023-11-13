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

const navigateToUpcoming = () => {
  window.location.href = "/upcoming";
};

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
            <Flex flexWrap="wrap" justifyContent="initial" >
              {nowShowingMovies.map((film) => (
                <MovieCard key={film} film={film} />
              ))}
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
