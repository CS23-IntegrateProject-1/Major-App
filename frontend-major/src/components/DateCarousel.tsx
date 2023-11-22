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
import { FC, useState } from "react";

export const DateCarousel: FC = () => {
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
