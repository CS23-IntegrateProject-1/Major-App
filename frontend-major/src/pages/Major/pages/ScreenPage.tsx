import { Box, Center, Image, Text, Grid, Button } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Axios } from "../../../AxiosInstance";
import { MovieSeat } from "../../../components/MovieSeat/MovieSeat";
import { TypeOfSeatCard } from "../../../components/MovieSeat/TypeOfSeatCard";

interface ShowDetails {
  show: Show;
  startTime: string;
}

interface Show {
  date: string;
  endTime: string;
  filmId: number;
  price: string;
  screenId: number;
  showId: number;
  startTime: string;
  Screens: Screen;
  Films: Film;
}

interface Screen {
  capacity: number;
  screenId: number;
  screenType: string;
  screen_number: number; // This was corrected from screenNo to screen_number based on the log
  theaterId: number;
}

interface Film {
  duration: number;
  filmId: number;
  genre: string;
  language: string;
  name: string;
  posterImg: string;
  rate: number;
  releaseDate: string;
  synopsis: string;
}

interface type {
  typeName: string;
  finalPrice: number;
}

const ScreenPage: React.FC = () => {
  const posterWidth = "25vh"; // Replace with your desired movie poster width
  const posterHeight = "40vh"; // Replace with your desired movie poster height
  const filmId = useParams<{ filmId: string }>().filmId;
  const date = useParams<{ date: string }>().date;
  const filmid = parseInt(filmId || "0");
  const theaterId = useParams<{ theaterId: string }>().theaterId;
  const theaterid = parseInt(theaterId || "0");
  const showId = useParams<{ showId: string }>().showId;
  const showid = parseInt(showId || "0");

  console.log(showid);

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
  const [allShowDetails, setAllShowDetails] = useState<ShowDetails>();
  useEffect(() => {
    if (showid) {
      Axios.get(`http://localhost:3000/show/getShowByShowId/${showid}`)
        .then((response) => {
          setAllShowDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching show details:", error);
        });
    }
  }, [showid]);
  useEffect(() => {
    if (
      allShowDetails &&
      allShowDetails.show &&
      allShowDetails.show.Screens &&
      allShowDetails.show.Screens.screenId &&
      showid
    ) {
      const screenId = allShowDetails.show.Screens.screenId;
      console.log("Screen ID:", screenId); // Log screenId
      Axios.get(
        `http://localhost:3000/seat/getUniqueSeatTypeByScreenId/${screenId}/${showid}`
      )
        .then((response) => {
          setSeatType(response.data);
        })
        .catch((error) => {
          console.error("Error fetching seat types:", error);
        });
    }
  }, [allShowDetails, showid]);

  const [movieInfo, setMovieInfo] = useState<film>({} as film);
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
  // console.log(formatDate(date));

  useEffect(() => {
    try {
      Axios.get(`http://localhost:3000/film/getFilmById/${filmid}`).then(
        (response) => {
          setMovieInfo(response.data);
        }
      );
    } catch (error) {
      console.error("Error fetching now showing movies:", error);
    }
  }, [filmid]);

  interface theater {
    theaterId: number;
    name: string;
    address: string;
    phoneNum: string;
    promptPayNum: string;
    latitude: string;
    longitude: string;
  }

  const [theaterInfo, setTheaterInfo] = useState<theater>({} as theater);

  useEffect(() => {
    try {
      Axios.get(
        `http://localhost:3000/theater/getTheaterById/${theaterid}`
      ).then((response) => {
        setTheaterInfo(response.data);
      });
    } catch (error) {
      console.error("Error fetching now showing theatre:", error);
    }
  }, [theaterid]);

  const [seatType, setSeatType] = useState([]);

  useEffect(() => {
    Axios.get(
      `http://localhost:3000/http://localhost:3000/seat/getUniqueSeatTypeByScreenId/${allShowDetails?.show.Screens.screenId}/${showid}`
    )
      .then((response) => {
        setSeatType(response.data);
      })
      .catch((error) => {
        console.error("Error fetching now showing movies:", error);
      });
  }, []);

  return (
    <>
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
          <Text color={"gold"} style={TextStyle.h1} mb={2}>
            {movieInfo.name}
          </Text>
          <Text style={TextStyle.body1} mb={2}>
            {movieInfo.language}
          </Text>
          <Text style={TextStyle.body1} mb={2}>
            {movieInfo.duration} minutes
          </Text>
        </Box>
      </Box>
      {/* Place + Theater name and time  */}
      <Box>
        <Text style={TextStyle.body1} mb={2}>
          {theaterInfo.name}
        </Text>
        <Box display="flex" flexDirection="row">
          <Center style={TextStyle.body1} mb={2} mr={20}>
            Screen {allShowDetails?.show.Screens.screen_number}
          </Center>
          <Center style={TextStyle.body1} mb={2} mr={2}>
            {allShowDetails?.show.date
              ? formatDate(allShowDetails?.show.date)
              : ""}
          </Center>
          <Center
            style={TextStyle.body1}
            ml={20}
            backgroundColor={"gold"}
            padding="0.5%"
            borderRadius="10%"
          >
            {allShowDetails?.startTime.slice(0, 5)}
          </Center>
        </Box>
      </Box>

      {/* select seat */}
      <MovieSeat />
      <Center>
        <Grid
          templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          gap={4}
          maxWidth="800px" // Adjust the maximum width as needed
          width="100%"
        >
          {seatType.map((type) => (
            <Box key={type}>
              <TypeOfSeatCard type={type} />
            </Box>
          ))}
        </Grid>
      </Center>

      <Box display="flex" flexDirection="row" justifyContent="center">
        <Text>Seat no: </Text>
        <Text>Price: </Text>
      </Box>
    </>
  );
};

export default ScreenPage;
