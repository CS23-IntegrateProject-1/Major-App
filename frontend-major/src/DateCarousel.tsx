import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, HStack, Icon, Center, Text, Flex } from "@chakra-ui/react";
import { FC, useState } from "react";


export const DateCarousel: FC = () => {
  const [tab, setTab] = useState<number>(0);
  const dates: string[] = [
    "Fri 17 Nov",
    "Sat 18 Nov",
    "Sun 19 Nov",
    "Mon 20 Nov",
    "Tue 21 Nov",
    "Wed 22 Nov",
    "Thu 23 Nov",
    "Fri 24 Nov",
    "Sat 25 Nov",
    "Sun 26 Nov",
    "Mon 27 Nov",
  ];

//   const generateDay = (numberOfDay: number) => {
//     const dates: string[] = [];
//     const months: string[] = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];
//     let todayTime = new Date();
//     for (let i: number = 0; i < numberOfDay; i++) {
//       let dateFormat: string;
//       let date: Date = new Date(todayTime.getTime() + 24 * 60 * 60 * 1000 * i);
//       const day: number = date.getDay();
//       const month: number = date.getMonth() + 1;
//         const year: number = date.getFullYear();
//     const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
//     const dayName: string = date.toLocaleString('en-US', options);
//       console.log(date.getDate);
//       dateFormat = `${dayName} ${day} ${months[month]}`;
//     dateFormat = `${dayName} ${todayTime.getDate()} ${todayTime.toLocaleString('en-US', { month: 'short' })}`;

//     todayTime.setDate(todayTime.getDate()+1);

//       console.log(date.getDate);
//       dates.push(dateFormat);
//     }
//     return dates;
//   };

//   console.log(generateDay(7));

const generateDay = (numberOfDays: number): string[] => {
    const dates: string[] = [];
    const daysOfWeek: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months: string[] = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    let todayTime = new Date();
  
    for (let i = 0; i < numberOfDays; i++) {
      const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
      const dayName: string = todayTime.toLocaleString('en-US', options);
  
      const dayOfMonth: number = todayTime.getDate();
      const monthIndex: number = todayTime.getMonth();
    //   const year: number = todayTime.getFullYear();
  
      const dateFormat: string = ` ${daysOfWeek[todayTime.getDay()]} ${dayOfMonth} ${months[monthIndex]}`;
      dates.push(dateFormat);
  
      todayTime.setDate(todayTime.getDate() + 1); // Move to the next day for the next iteration
    }
  
    console.log(dates);
    return dates;
  };
  
  // Usage example:
  const numberOfDays: number = 7;
  generateDay(numberOfDays);

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
        <Icon
          as={ChevronLeftIcon}
          cursor={"pointer"}
          onClick={handleLefttClick}
          zIndex={1}
        />
        <HStack w={"400px"} overflow={"hidden"}>
          <Flex transform={`translateX(-${tab * 100}px)`}>
            {dates.map((date) => (
              <Center h={"60px"} minW={"100px"} cursor={"pointer"} zIndex={99}>
                <Text>{date}</Text>
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
