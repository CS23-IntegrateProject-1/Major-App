import {
  Box,
  Center,
  Image,
  Text,
  Grid,
  Flex,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import React, { useEffect, useState } from "react";
import { Axios } from "../../../AxiosInstance";
import { MovieSeat } from "../../../components/MovieSeat/MovieSeat";
import { TypeOfSeatCard } from "../../../components/MovieSeat/TypeOfSeatCard";
import { useParams, useNavigate } from "react-router-dom";

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
  finalPrice: number;
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
  const [selectedSeatId, setSelectedSeatId] = useState<number | null>(null);

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
      Axios.get(`/show/getShowByShowId/${showid}`)
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
      Axios.get(`/seat/getUniqueSeatTypeByScreenId/${screenId}/${showid}`)
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
      Axios.get(`/film/getFilmById/${filmid}`).then((response) => {
        setMovieInfo(response.data);
      });
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
      Axios.get(`/theater/getTheaterById/${theaterid}`).then((response) => {
        setTheaterInfo(response.data);
      });
    } catch (error) {
      console.error("Error fetching now showing theatre:", error);
    }
  }, [theaterid]);

  //seat
  const [seatType, setSeatType] = useState<SeatType[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Array<string>>([]);
  const [availableSeats, setAvailableSeats] = useState<Array<number>>([]);
  // const [notAvailableSeat, setNotAvailableSeat] = useState<Array<number>>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [error, setError] = useState(null);
  console.log(error);

  useEffect(() => {
    if (
      allShowDetails &&
      allShowDetails.show &&
      allShowDetails.show.screenId &&
      showId
    ) {
      Axios.get(
        `/seat/getSeatInfoByScreenId/${allShowDetails.show.screenId}/${showId}`
      )
        .then((response) => {
          setSeats(response.data);
          fetchAvailableSeats();
        })
        .catch((error) => setError(error.message));
    }
  }, [allShowDetails, showId]);

  const fetchAvailableSeats = () => {
    if (
      allShowDetails &&
      allShowDetails.show &&
      allShowDetails.show.screenId &&
      showId
    ) {
      Axios.get(
        `/seat/getAvailableSeatIdByShowIdAndScreenId/${showId}/${allShowDetails.show.screenId}`
      )
        .then((response) => {
          setAvailableSeats(response.data);
        })
        .catch((error) => setError(error.message));
    }
  };

  // const notAvailable = () =>{
  //   const notAvailableSeat = seats
  //   .filter((seat) => !availableSeats.includes(seat.seatId))
  //   .map((seat) => seat.seatId);
  //   setNotAvailableSeat(notAvailableSeat);
  //   console.log(notAvailableSeat);
  //   return notAvailableSeat;
  // }

  const isNotAvailable = (seatId: number) => {
    const notAvailableSeat = seats
      .filter((seat) => !availableSeats.includes(seat.seatId))
      .map((seat) => seat.seatId);
    if (notAvailableSeat.includes(seatId)) {
      return true;
    }
    return false;
  };

  const handleSeatClick = (seatId: number) => {
    const seatRow = seats.find((seat) => seat.seatId === seatId)?.seatRow;
    const seatNo = seats.find((seat) => seat.seatId === seatId)?.seatNo;
    const row = String.fromCharCode(64 + parseInt(seatRow || "0", 10));
    const seatIdentifier = `${row}${seatNo}`;
    if (availableSeats.includes(seatId)) {
      setSelectedSeatId(selectedSeatId !== seatId ? seatId : null);
      setSelectedSeats((prevSelectedSeats) => {
        if (prevSelectedSeats.includes(seatIdentifier)) {
          return prevSelectedSeats.filter((id) => id !== seatIdentifier);
        } else {
          return [...prevSelectedSeats, seatIdentifier];
        }
      });
    }
  };

  function getSeatIdFromIdentifier(seatIdentifier: string) {
    return seats.find(
      (s) =>
        `${String.fromCharCode(64 + parseInt(s.seatRow, 10))}${s.seatNo}` ===
        seatIdentifier
    )?.seatId;
  }
  useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;
      for (const seatIdentifier of selectedSeats) {
        const seatId = getSeatIdFromIdentifier(seatIdentifier); // Convert back to seatId
        const seat = seats.find((s) => s.seatId === seatId);
        const seatTypeObj = seatType.find(
          (type) => type.seatTypeId === seat?.Seat_Types.seatTypeId
        );
        total += seatTypeObj ? seatTypeObj.finalPrice : 0;
      }
      return total;
    };

    setTotalPrice(calculateTotalPrice());
  }, [selectedSeats, seatType, seats]);

  const seatsByRow: { [key: string]: Seat[] } = seats.reduce((acc, seat) => {
    acc[seat.seatRow] = acc[seat.seatRow] || [];
    acc[seat.seatRow].push(seat);
    return acc;
  }, {} as { [key: string]: Seat[] });
  console.log(seats);
  console.log(seatsByRow);

  console.log("Selected Seats:", selectedSeats);
  console.log("Seat Types:", seatType);
  console.log("Seats:", seats);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleSelect = () => {
    if (selectedSeats.length === 0) {
      onOpen(); // Open modal if no seat is selected
    } else {
      const seatIds = selectedSeats
        .map((seatIdentifier) => {
          const seatId = getSeatIdFromIdentifier(seatIdentifier);
          return seatId ? `${seatId}` : "";
        })
        .join(",");

      const selectedSeatTypes = selectedSeats
        .map((seatIdentifier) => {
          const seatId = getSeatIdFromIdentifier(seatIdentifier);
          const seat = seats.find((s) => s.seatId === seatId);
          return seat ? `${seat.Seat_Types.typeName}` : "";
        })
        .join(",");

    //   const selectedSeatRows = selectedSeats
    //     .map((seatIdentifier) => seatIdentifier.charAt(0)) // Extracting the row letter from seat identifier
    //     .join(","); // Joining rows with a comma

      navigate(
        `/PendingOrder?seatIds=${seatIds}&seatTypes=${selectedSeatTypes}&totalPrice=${totalPrice}&showid=${showid}&selectedSeats=${selectedSeats.join(
          ","
        )}` // Include selectedSeats in the URL
      );
    }
  };

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
          .map(([row, seatsInRow]) => {
            const rowLetter = String.fromCharCode(64 + parseInt(row, 10));

            return (
              <Flex key={row} align="center" mb={4}>
                <Text
                  minWidth="50px"
                  textAlign="right"
                  fontWeight="bold"
                  mr={4}
                >
                  {rowLetter}
                </Text>
                {seatsInRow.map((seat) => {
                  const seatIdentifier = `${rowLetter}${seat.seatNo}`;
                  return (
                    <MovieSeat
                      key={seat.seatId}
                      seatId={seat.seatId}
                      isSelected={selectedSeats.includes(seatIdentifier)}
                      isNotAvailable={isNotAvailable(seat.seatId)}
                      onSeatClick={(seatId: number) => {
                        if (isNotAvailable(seatId)) {
                          return;
                        }
                        handleSeatClick(seatId);
                      }}
                      type={seat.Seat_Types.typeName}
                    />
                  );
                })}
              </Flex>
            );
          })}
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
            <Box key={String(type)}>
              <TypeOfSeatCard type={type} key={String(type.seatTypeId)} />
            </Box>
          ))}
        </Grid>
      </Center>
      <Flex justifyContent="center" marginTop="20px">
        <Text>
          Selected Seat No:{" "}
          {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
        </Text>
        <Text marginLeft="20px">Total Price: {totalPrice} THB</Text>
      </Flex>

      {/* Buy buton */}
      <Center marginTop={6}>
        <Button
          bg="gold"
          _hover={{ bg: "gold" }}
          size="md"
          width="15rem"
          onClick={handleSelect} // Trigger function on button click
        >
          BUY
        </Button>
      </Center>

      {/* Modal for displaying the message */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="black">Please select a seat</ModalHeader>
          <ModalBody color="black">
            You haven't selected a seat yet. Please select a seat before
            proceeding.
          </ModalBody>
          <ModalFooter>
            <Button bg="gold" _hover={{ bg: "gold" }} mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ScreenPage;
