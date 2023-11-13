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
          <Text color={"gold"} {...TextStyle.body2} mb={2}>
            {movieInfo.releaseDate? formatDate(movieInfo.releaseDate) : 'N/A'}
          </Text>
          <Text {...TextStyle.h1} mb={2}>
            {movieInfo.name}
          </Text>
          <Text {...TextStyle.body2} mb={2}>
            {movieInfo.genre}
          </Text>
          <Text {...TextStyle.body2} mb={2}>
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
            <Text {...TextStyle.h2} mt={2} mb={2}>
              Synopsis
            </Text>
            <Text {...TextStyle.body2} mt={2} mb={2} align={"justify"}>
              {movieInfo.synopsis}
            </Text>
          </TabPanel>

          {/* Show (โรง+รอบหนัง) */}
          <TabPanel>
            {/* วันที่ที่เลื่อนได้ */}
            <Text {...TextStyle.h2} mt={2} mb={2}>
              Date swipe
            </Text>
            {/* Show (โรง+รอบหนัง) slide ลงมา */}
            <Accordion defaultIndex={[0]} allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <Text {...TextStyle.h2}>Theatre name 1 </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} {...TextStyle.body2}>
                  <Text mb={"2"}>Theatre 1 | EN </Text>
                  <Box display={"flex"} flexDirection={"row"}>
                    <Button size="xs" mr={"4"}>
                      13:00
                    </Button>
                    <Button size="xs" mr={"4"}>
                      16:00
                    </Button>
                    <Button size="xs" mr={"4"}>
                      19:00
                    </Button>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MovieInformationPage;
