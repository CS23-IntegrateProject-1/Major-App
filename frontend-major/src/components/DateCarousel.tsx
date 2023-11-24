import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  Icon,
  Center,
  Text,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

interface DateCarouselProps {
  onDateSelect: (date: string) => void;
};

export const DateCarousel: React.FC<DateCarouselProps> = ({ onDateSelect }) => {

  const handleDateClick = (date?: string) => {
    const formattedDate = formatDate(date);
    onDateSelect(formattedDate);
    console.log(formattedDate)
  };
  
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns 0-11
      const day = today.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    const months: { [key: string]: string } = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    const parts = dateStr.split(' ');
    const day = parts[2]; 
    const month = months[parts[3]];
    const year = new Date().getFullYear();
  
    return `${year}-${month}-${day}`;
  };
  

  const [tab, setTab] = useState<number>(0);

  const generateDay = (numberOfDays: number): string[] => {
    const dates: string[] = [];
    const daysOfWeek: string[] = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ];
    const months: string[] = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let todayTime = new Date();
    todayTime.setDate(todayTime.getDate()); // Set current date

    const endDate = new Date(
      todayTime.getTime() + numberOfDays * 24 * 60 * 60 * 1000
    ); // Calculate end date

    while (todayTime <= endDate) {
      // const options: Intl.DateTimeFormatOptions = { weekday: "short" };
      // const dayName: string = todayTime.toLocaleString("en-US", options);

      const dayOfMonth: number = todayTime.getDate();
      const monthIndex: number = todayTime.getMonth();

      const dateFormat: string = ` ${
        daysOfWeek[todayTime.getDay()]
      } ${dayOfMonth} ${months[monthIndex]}`;
      dates.push(dateFormat);

      todayTime.setDate(todayTime.getDate() + 1); // Move to the next day for the next iteration
    }

    // console.log(dates);
    return dates;
  };

  // Usage example:
  const numberOfDays: number = 7;
  const dates: string[] = generateDay(numberOfDays);

  const handleLefttClick = () => {
    let prev = tab;
    if (prev === 0) {
      return;
    } else {
      setTab(prev - 1);
    }
  };

  const handleRightClick = () => {
    let prev = tab;
    if (prev === 3) {
      return;
    } else {
      setTab(prev + 1);
    }
  };

  return (
    <Box>
      <HStack>
        <Button
          size="sm"
          colorScheme="white"
          variant="outline"
          color="gold"
          _hover={{
            color: "white",
            bg: "gold",
            borderColor: "gold",
            transition: "color 0.3s ease-in-out",
          }}
          borderColor="white"
          onClick={() => handleDateClick(dates[0])}
        >
          {dates[0]}
        </Button>
        <Icon
          as={ChevronLeftIcon}
          cursor={"pointer"}
          onClick={handleLefttClick}
          zIndex={1}
        />
        <HStack w={"400px"} overflow={"hidden"}>
          <Flex transform={`translateX(-${tab * 100}px)`}>
            {dates.slice(1).map((date, index) => (
              <Center
                key={index}
                h={"60px"}
                minW={"100px"}
                cursor={"pointer"}
                zIndex={99}
                onClick={() => handleDateClick(date)}
              >
                <Text
                  _hover={{
                    color: "gold", // Change text color on hover
                    transition: "color 0.3s ease-in-out",
                  }}
                >
                  {date}
                </Text>
              </Center>
            ))}
          </Flex>
        </HStack>
        <Icon
          as={ChevronRightIcon}
          cursor={"pointer"}
          onClick={handleRightClick}
          zIndex={1}
        />
      </HStack>
    </Box>
  );
};