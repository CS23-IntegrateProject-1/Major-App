import { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
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

  useEffect(() => {
    Axios.get("http://localhost:3000/film/getCurrentFilm")
    .then((response) => {
      setNowShowingMovies(response.data);
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
          {nowShowingMovies.map((film) => (
            <MovieCard key={film.filmId} film={film} />
          ))}
          </TabPanel>
          <TabPanel>{/* upcoming has nothing */}</TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MoviePage;
