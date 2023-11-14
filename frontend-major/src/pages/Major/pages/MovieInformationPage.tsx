import { Box, Text, Image, Button } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import { useEffect, useState } from "react";
import { Axios } from "../../../AxiosInstance";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
} from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

interface Film {
  name: string;
  date: string;
  startTime: string;
  screenNo: number;
}

interface Screen {
  screenId: number;
  theaterId: number;
  capacity: number;
  screenType: string;
  screen_number: number;
}

interface ScreenWithFilms {
  screenId: number;
  theaterId: number;
  capacity: number;
  screenType: string;
  films: Film[];
}


const MovieInformationPage = () => {
  interface film {
  filmId: number; 
  name: string;
  posterImg: string; 
  synopsis: string;
  releaseDate: string;
  duration: string;
  genre: string;
}
  const posterWidth = "150px"; // Replace with your desired movie poster width
  const posterHeight = "225px"; // Replace with your desired movie poster height

  const buttonWidth = "200px";
  const buttonHeight = "100px";

  const [movieInfo, setMovieInfo] = useState<film>({} as film);
  const { filmId } = useParams<{ filmId?: string }>();
  const id = parseInt(filmId || "");

  useEffect(() => {
    try {
      Axios.get(`http://localhost:3000/film/getFilmById/${id}`).then(
        (response) => {
          setMovieInfo(response.data);
        }
      );
    } catch (error) {
      console.error("Error fetching now showing movies:", error);
    }
  }, [id]);

  
  const [showtimesByScreen, setShowtimesByScreen] = useState<ScreenWithFilms[]>([]);
  const fetchShowtimes = async () => {
    try {
      const response = await Axios.get(`http://localhost:3000/show/getShowFromFilmIdAndDate/${id}/2023-11-08`);
      console.log(response.data); 

      if (!response.data || response.data.length === 0) {
        throw new Error('No data received from API');
      }

      const groupedByScreen = response.data.reduce((acc: { [key: number]: ScreenWithFilms }, item: any) => {
        //skip if no screen or no films
        if (!item.screen || !item.films || item.films.length === 0) {
          return acc; 
        }
        const screenNo = item.screen.screen_number;
        if (!acc[screenNo]) {
          acc[screenNo] = {
            screenId: item.screen.screenId,
            theaterId: item.screen.theaterId,
            capacity: item.screen.capacity,
            screenType: item.screen.screenType,
            films: []
          };
        }
        acc[screenNo].films.push(...item.films);
        return acc;
      }, {});

      const screenWithFilmsArray: ScreenWithFilms[] = Object.values(groupedByScreen);
      setShowtimesByScreen(screenWithFilmsArray);
      console.log('Grouped by screen:', screenWithFilmsArray); // Check the grouped data
    } catch (error) {
      console.error("Error fetching showtimes:", error);
    }
  };

  useEffect(() => {
    // ... [existing Axios call to fetch movie info]
    fetchShowtimes();
  }, [id]);

  
  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
    return formattedDate.replace(/,/, '');
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  return (
    <Box>
      {/* Movie Info at top*/}
      <Box display={"flex"} flexDirection={"row"} paddingBottom={"7"}>
        <Box>
          <Image
            src={movieInfo.posterImg}
            alt={movieInfo.name}
            borderRadius="lg"
            width={posterWidth}
            height={posterHeight}
          />
        </Box>
        <Box display={"flex"} flexDirection={"column"} padding={"4"}>
          <Text color={"gold"} style={TextStyle.body2} mb={2}>
            {movieInfo.releaseDate? formatDate(movieInfo.releaseDate) : 'N/A'}
          </Text>
          <Text style={TextStyle.h1} mb={2}>
            {movieInfo.name}
          </Text>
          <Text style={TextStyle.body2} mb={2}>
            {movieInfo.genre}
          </Text>
          <Text style={TextStyle.body2} mb={2}>
            {movieInfo.duration} minutes
          </Text>
        </Box>
      </Box>

      {/* Tab details and show */}
      <Tabs isFitted position="relative" variant="unstyled">
        <TabList>
          <Tab _selected={{ color: "gold" }}>Details</Tab>
          <Tab _selected={{ color: "gold" }}>Show</Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="gold" borderRadius="1px" />
        <TabPanels>
          {/* Details */}
          <TabPanel>
            <Text style={TextStyle.h2} mt={2} mb={2}>
              Synopsis
            </Text>
            <Text style={TextStyle.body2} mt={2} mb={2} align={"justify"}>
              {movieInfo.synopsis}
            </Text>
          </TabPanel>

          {/* Show (โรง+รอบหนัง) */}
          <TabPanel>
    {/* ... [date swipe remains unchanged] */}
    <Accordion defaultIndex={[0]} allowMultiple>
     <h1 style={TextStyle.h1}>2023-11-08</h1>
      {showtimesByScreen.map((screen, index) => (
        <AccordionItem key={index}>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              <Text style={TextStyle.h2}>Screen {screen.screenType} {screen.screenId}</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} style={TextStyle.body2}>
            {screen.films.map((film, idx) => (
              <Box key={idx}>
                <Text mb={"2"}>{film.name} | {new Date(film.date).toLocaleDateString()}</Text>
                <Button size="xs" mr={"4"}>
                  {formatTime(film.startTime)}                                                                
                </Button>
              </Box>
            ))}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MovieInformationPage;
