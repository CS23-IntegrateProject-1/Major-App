import { Box, Center, Image, Text } from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Axios } from "../../../AxiosInstance";

const ScreenPage = () => {
  const posterWidth = "25vh"; // Replace with your desired movie poster width
  const posterHeight = "40vh"; // Replace with your desired movie poster height
  const filmId = useParams<{ filmId: string }>().filmId;
  const date = useParams<{ date: string }>().date;
  const filmid = parseInt(filmId || "0");
  const theaterId = useParams<{ theaterId: string }>().theaterId;
  const theaterid = parseInt(theaterId || "0");
  console.log(date);

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

  // interface Show {
  //   filmId: number;
  //   name: string;
  //   date: string;
  //   startTime: string;
  //   screenNo: number;
  // }

  // const [showInfo, setShowInfo] = useState<Show>({} as Show);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await Axios.get(
  //         `http://localhost:3000/show/getShowFromFilmIdAndDate/${filmid}/${dateday}`
  //       );
  //       setShowInfo(response.data);
  //     } catch (error) {
  //       console.error("Error fetching show information:", error);
  //     }
  //   };

  //   fetchData();
  // }, [dateday]);

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
      <Box>
        <Text style={TextStyle.body1} mb={2}>
          {theaterInfo.name}
        </Text>
        <Box display="flex" flexDirection="row">
          <Center style={TextStyle.body1} mb={2} mr={20}>
            Theatre 1
          </Center>
          <Center
            style={TextStyle.body1}
            ml={20}
            backgroundColor={"gold"}
            padding="0.5%"
            borderRadius="10%"
          >
            {/* {showInfo.startTime} */}
          </Center>
        </Box>
      </Box>
    </>
  );
};

export default ScreenPage;
