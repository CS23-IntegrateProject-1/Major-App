import { Box, Center, Image, Text, Grid, Flex} from "@chakra-ui/react";
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
  screen_number: number; 
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

interface Seat {
  seatId: number;
  Seat_Types: SeatType;
  screenId: number;
  showId: number;
  seatRow: string;
  seatNo: number;
}

interface SeatType {
  seatTypeId: number;
  typeName: string;
  price: number;
}

const ScreenPage: React.FC = () => {
  const posterWidth = "25vh"; // Replace with your desired movie poster width
  const posterHeight = "40vh"; // Replace with your desired movie poster height
  const filmId = useParams<{ filmId: string }>().filmId;
  // const date = useParams<{ date: string }>().date;
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



  //seat
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Array<number>>([]);
  const [availableSeats, setAvailableSeats] = useState<Array<number>>([]);
  
  const [error, setError] = useState(null);

  useEffect(() => {
    Axios.get(`http://localhost:3000/seat/getSeatInfoByScreenId/${allShowDetails?.show.screenId}/${showId}`)
      .then(response => {
        setSeats(response.data);
        fetchAvailableSeats();
      })
      .catch(error => setError(error.message));
  }, [allShowDetails?.show.screenId, showId]);

  
  const fetchAvailableSeats = () => {
    Axios.get(`http://localhost:3000/seat/getAvailableSeats/${allShowDetails?.show.screenId}/${showId}`)
        .then(response => setAvailableSeats(response.data))
        .catch(error => setError(error.message));
  };

  const handleSeatClick = (seatId: number) => {
    if (availableSeats.includes(seatId)) {
      setSelectedSeats((prevSelectedSeats: Array<number>) => {
        if (prevSelectedSeats.includes(seatId)) {
          return prevSelectedSeats.filter((id) => id !== seatId);
        } else {
          return [...prevSelectedSeats, seatId];
        }
      });
    }
  };

  const seatsByRow: { [key: string]: Seat[] } = seats.reduce((acc, seat) => {
    acc[seat.seatRow] = acc[seat.seatRow] || [];
    acc[seat.seatRow].push(seat);
    return acc;
  }, {} as { [key: string]: Seat[] });
  console.log(seats)
  console.log(seatsByRow)
  
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
     {/* Screen */}
      <Center
        style={TextStyle.h2}
        mt={10}
        mb={10}
        borderWidth="0.2vw"
        borderColor="gold"
        p={1} // Padding to make the border visible
      >
        screen
      </Center>

      {/* seat */}
      <Center flexDir="column">
        {Object.entries(seatsByRow)
          .sort((a, b) => parseInt(b[0], 10) - parseInt(a[0], 10)) 
          .map(([row, seatsInRow]) => (
            <Flex key={row} justifyContent="center" mb={4}>
            {seatsInRow.map(seat => (
              <MovieSeat
                key={seat.seatId}
                seatId={seat.seatId}
                isSelected={selectedSeats.includes(seat.seatId)}
                onSeatClick={handleSeatClick}
                type={seat.Seat_Types.typeName}
              />
            ))}
            </Flex>
          ))}
      </Center>


      {/* TypeCard */}
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
