import { Box, Text, Image, Button } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import { useEffect, useState } from "react";
import { Axios } from "../../../AxiosInstance";
import { Flex } from "@chakra-ui/react";
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
import { DateCarousel } from "../../../components/DateCarousel";

interface Film {
  name: string;
  date: string;
  startTime: string;
  screenNo: number;
}

interface TheaterScreenFilms {
  [theaterName: string]: {
    [screenNo: number]: ScreenDetails;
  };
}

interface ScreenDetails {
  screenType: string;
  films: Film[];
}

interface NearestTime {
  date: string;
  startTime: string;
}

// interface ScreenWithFilms {
//   screenId: number;
//   theaterId: number;
//   theaterName?: string;
//   capacity: number;
//   screenType: string;
//   films: Film[];
// }
// interface Theater {
//   theaterId: number;
//   name: string;
//   address: string;
//   phoneNum: string;
//   promptPayNum: string;
//   latitude: number;
//   longitude: number;
// }

const MovieInformationPage = () => {
  interface film {
    filmId: number;
    name: string;
    posterImg: string;
    synopsis: string;
    releaseDate: string;
    duration: string;
    genre: string;
    language: string;
  }

  const posterWidth = "25vh"; // Replace with your desired movie poster width
  const posterHeight = "40vh"; // Replace with your desired movie poster height

  // const buttonWidth = "200px";
  // const buttonHeight = "100px";

  const nearestStyle = {
    backgroundColor: "#d2ab5a",
    color: "black",
  };

  const futureStyle = {
    backgroundColor: "transparent",
    border: "1px solid #d2ab5a",
    color: "#d2ab5a",
  };

  const notAvailableStyle = {
    backgroundColor: "transparent",
    border: "1px solid grey",
    color: "grey",
  };

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

  const [showtimesByTheater, setShowtimesByTheater] =
    useState<TheaterScreenFilms>({});

  const fetchShowtimes = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:3000/show/getShowFromFilmIdAndDate/${id}/2023-11-18`
      );
      if (!response.data || response.data.length === 0) {
        throw new Error("No data received from API");
      }
      // const screenType = response.data[0].screen.screenType;
      const theaterNamesResponses = await Promise.all(
        response.data.map((screen: ScreenWithFilms) =>
          Axios.get(
            `http://localhost:3000/theater/getTheaterById/${screen.screen.theaterId}`
          )
        )
      );

      interface ScreenWithFilms {
        screen: {
          screenId: number;
          theaterId: number;
          screen_number: number;
          screenType: string;
        };
        films: Film[];
      }

      const groupedData: TheaterScreenFilms = {};
      response.data.forEach((screen: ScreenWithFilms, index: number) => {
        const theaterName = theaterNamesResponses[index].data.name;
        const screenNo = screen.screen.screen_number;

        if (!groupedData[theaterName]) {
          groupedData[theaterName] = {};
        }
        if (!groupedData[theaterName][screenNo]) {
          groupedData[theaterName][screenNo] = {
            screenType: screen.screen.screenType,
            films: [],
          };
        }
        groupedData[theaterName][screenNo].films.push(...screen.films);
      });

      setShowtimesByTheater(groupedData);
    } catch (error) {
      console.error("Error fetching showtimes:", error);
    }
  };
  useEffect(() => {
    fetchShowtimes();
  }, [id]);

  const isPastTime = (showDate: string, showTime: string) => {
    const now = new Date();
    const showDateTime = new Date(`${showDate}T${showTime}`);
    return showDateTime < now;
  };

  const findNearestFutureTimeForScreen = (
    screenDetails: ScreenDetails
  ): NearestTime | null => {
    const now = new Date();
    let nearestTime = null;
    let minDiff = Number.MAX_SAFE_INTEGER;

    screenDetails.films.forEach((film) => {
      const datePart = film.date.split("T")[0];
      const showDateTimeStr = `${datePart}T${film.startTime}`;
      const showDateTime = new Date(showDateTimeStr);

      const diff = showDateTime.getTime() - now.getTime();
      if (!isNaN(diff) && diff > 0 && diff < minDiff) {
        nearestTime = { date: film.date, startTime: film.startTime };
        minDiff = diff;
      }
    });

    return nearestTime;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(
      date
    );
    return formattedDate.replace(/,/, "");
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
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
            {movieInfo.releaseDate ? formatDate(movieInfo.releaseDate) : "N/A"}
          </Text>
          <Text style={TextStyle.h1} mb={2}>
            {movieInfo.name}
          </Text>
          <Text style={TextStyle.body2} mb={2}>
            {movieInfo.genre} | {movieInfo.language}
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
            <DateCarousel />
            <Accordion defaultIndex={[0]} allowMultiple>
              {Object.entries(showtimesByTheater).map(
                ([theaterName, screens], theaterIdx) => (
                  <AccordionItem key={theaterIdx}>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        <Text style={TextStyle.h2}>Theater {theaterName}</Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      {Object.entries(screens).map(
                        ([screenNo, screenDetails], screenIdx) => {
                          const nearestFutureTime =
                            findNearestFutureTimeForScreen(screenDetails);
                          return (
                            <Box key={screenIdx} p={2}>
                              <Text style={TextStyle.body1}>
                                Screen {screenNo} | {screenDetails.screenType}
                              </Text>
                              <Flex wrap="wrap" gap="10px">
                                {screenDetails.films.map((film, filmIdx) => {
                                  const isPast = isPastTime(
                                    film.date,
                                    film.startTime
                                  );
                                  const isNearest =
                                    nearestFutureTime !== null &&
                                    nearestFutureTime.date === film.date &&
                                    nearestFutureTime.startTime ===
                                      film.startTime;
                                  const future =
                                    new Date(film.date) > new Date() ||
                                    (new Date(film.date) === new Date() &&
                                      new Date(film.startTime) > new Date());

                                  return (
                                    <Box key={filmIdx}>
                                      <Button
                                        size="xs"
                                        mr={"4"}
                                        disabled={isPast}
                                        style={
                                          isNearest
                                            ? nearestStyle
                                            : future
                                            ? futureStyle
                                            : notAvailableStyle
                                        }
                                      >
                                        {formatTime(film.startTime)}
                                      </Button>
                                    </Box>
                                  );
                                })}
                              </Flex>
                            </Box>
                          );
                        }
                      )}
                    </AccordionPanel>
                  </AccordionItem>
                )
              )}
            </Accordion>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MovieInformationPage;
