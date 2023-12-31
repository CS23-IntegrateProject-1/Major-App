import { Box, Text, Image, Button } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import { useEffect, useState, useCallback } from "react";
import { Axios } from "../../../AxiosInstance";
import { Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
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
  filmId: number;
  name: string;
  date: string;
  startTime: string;
  screenNo: number;
  showId: number;
  theaterId: number;
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

const MovieInformationPage = () => {
  interface film {
    filmId: number;
    theaterId: number;
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

  const [selectedDate, setSelectedDate] = useState<string>("");
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const [movieInfo, setMovieInfo] = useState<film>({} as film);
  const { filmId } = useParams<{ filmId?: string }>();
  const id = parseInt(filmId || "");

  useEffect(() => {
    try {
      Axios.get(`/film/getFilmById/${id}`).then((response) => {
        setMovieInfo(response.data);
      });
    } catch (error) {
      console.error("Error fetching now showing movies:", error);
    }
  }, [id]);

  const [showtimesByTheater, setShowtimesByTheater] =
    useState<TheaterScreenFilms>({});

  const fetchShowtimes = useCallback(async () => {
    try {
      let dateToUse = selectedDate;
      if (selectedDate === "") {
        const today = new Date();
        const offset = today.getTimezoneOffset() * 60000;
        const localISODate = new Date(today.getTime() - offset)
          .toISOString()
          .split("T")[0];
        dateToUse = localISODate;
      }
      const response = await Axios.get(
        `/show/getShowFromFilmIdAndDate/${id}/${dateToUse}`
      );
      if (!response.data || response.data.length === 0) {
        setShowtimesByTheater({});
        throw new Error("No data received from API");
      }
      // const screenType = response.data[0].screen.screenType;
      const theaterNamesResponses = await Promise.all(
        response.data.map((screen: ScreenWithFilms) =>
          Axios.get(`/theater/getTheaterById/${screen.screen.theaterId}`)
        )
      );
      interface ScreenWithFilms {
        screen: {
          showId: number;
          screenId: number;
          theaterId: number;
          screenType: string;
        };
        films: Film[];
      }
      const groupedData: TheaterScreenFilms = {};
      response.data.forEach((screen: ScreenWithFilms, index: number) => {
        const theaterName = theaterNamesResponses[index].data.name;
        const screenNo = screen.films[0].screenNo;
        const showId = screen.screen.showId;
        const filmId = screen.films[0].filmId;
        const theaterId = screen.screen.theaterId;

        if (!groupedData[theaterName]) {
          groupedData[theaterName] = {};
        }
        if (!groupedData[theaterName][screenNo]) {
          groupedData[theaterName][screenNo] = {
            screenType: screen.screen.screenType,
            films: [],
          };
        }
        const filmsWithShowId: Film[] = screen.films.map((film) => ({
          ...film,
          filmId: filmId,
          theaterId: theaterId,
          showId: showId,
        }));

        groupedData[theaterName][screenNo].films.push(...filmsWithShowId);
      });
      setShowtimesByTheater(groupedData);
    } catch (error) {
      console.error("Error fetching showtimes:", error);
    }
  }, [selectedDate, id]);

  useEffect(() => {
    if (selectedDate) {
      fetchShowtimes();
    }
  }, [selectedDate, fetchShowtimes]);

  useEffect(() => {
    fetchShowtimes();
  }, [id, fetchShowtimes]);

  const isPastTime = (showDate: string, showTime: string): boolean => {
    const timeParts = showTime.split(":");
    if (timeParts.length === 2) {
      showTime += ":00";
    } else if (timeParts.length < 2 || timeParts.length > 3) {
      console.error("Invalid time format:", showTime);
      return false;
    }
    const showDateTimeStr = `${showDate.slice(0, 10)}T${showTime}+07:00`;
    const showDateTime = new Date(showDateTimeStr);

    // Validate the constructed Date object
    if (isNaN(showDateTime.getTime())) {
      console.error("Invalid date or time value:", showDateTimeStr);
      return false;
    }

    // Get the current date and time
    const now = new Date();

    // Compare the current date and time to the show date and time
    const result = now > showDateTime;

    // Return the result of the comparison
    return result;
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
            <DateCarousel onDateSelect={handleDateSelect} />
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
                                  const showDateTime = new Date(
                                    `${film.date.slice(0, 10)}T${
                                      film.startTime
                                    }`
                                  );
                                  const now = new Date();
                                  const future = showDateTime > now;

                                  const buttonStyle = isNearest
                                    ? nearestStyle
                                    : future
                                    ? futureStyle
                                    : notAvailableStyle;
                                  const buttonContent = (
                                    <Button
                                      as="div"
                                      size="xs"
                                      mr="4"
                                      disabled={isPast}
                                      style={buttonStyle}
                                    >
                                      {formatTime(film.startTime)}
                                    </Button>
                                  );

                                  return (
                                    <Box key={filmIdx}>
                                      {isPast ? (
                                        buttonContent
                                      ) : (
                                        <Link
                                          to={`/Screen/${film.filmId}/${film.date}/${film.showId}/${film.theaterId}`}
                                          style={{
                                            textDecoration: "none",
                                          }}
                                        >
                                          {buttonContent}
                                        </Link>
                                      )}
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
