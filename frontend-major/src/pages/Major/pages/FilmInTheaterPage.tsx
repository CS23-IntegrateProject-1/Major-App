import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { DateCarousel } from "../../../components/DateCarousel";
import { Axios } from "../../../AxiosInstance";
import { useEffect } from "react";
import {
	Box,
	Text,
	Flex,
	Image,
	VStack,
	HStack,
	Button,
} from "@chakra-ui/react";
import { TextStyle } from "../../../theme/TextStyle";

interface Screen {
	screenId: number;
	theaterId: number;
	screen_number: number;
	capacity: number;
	screenType: string;
}

interface Film {
	showId: number;
	filmId: number;
	name: string;
	date: string;
	startTime: string;
	screenNo: number;
	posterImg: string;
	duration: number;
	screenType: string;
}

interface TheaterScreening {
	screen: Screen;
	films: Film[];
}

interface Theater {
	theaterId: number;
	name: string;
	address: string;
	phoneNum: string;
	promptPayNum: string;
	latitude: string;
	longitude: string;
}

interface NearestTime {
	date: string;
	startTime: string;
}

interface buttonStyle {
	backgroundColor: string;
	color: string;
	border?: string;
}

const FilmInTheaterPage = () => {
	const posterWidth = "15vh";
	const posterHeight = "24vh";
	const nearestStyle: buttonStyle = {
		backgroundColor: "#d2ab5a",
		color: "black",
	};

	const futureStyle: buttonStyle = {
		backgroundColor: "transparent",
		border: "1px solid #d2ab5a",
		color: "#d2ab5a",
	};

	const notAvailableStyle: buttonStyle = {
		backgroundColor: "transparent",
		border: "1px solid grey",
		color: "grey",
	};
	const { theaterId } = useParams<{ theaterId: string }>();
	const id = parseInt(theaterId || "0");
	let theaterName = "";
	console.log(id);
	const [selectedDate, setSelectedDate] = useState<string>("");
	const handleDateSelect = (date: string) => {
		setSelectedDate(date);
	};
	console.log(selectedDate);
	const [filmsOrganizedByScreen, setFilmsOrganizedByScreen] = useState<
		Map<string, Map<number, Film[]>>
	>(new Map());
	const [theaterInfo, setTheaterInfo] = useState<Theater>({
		theaterId: 0,
		name: "",
		address: "",
		phoneNum: "",
		promptPayNum: "",
		latitude: "",
		longitude: "",
	});
	const fetchShowtimes = async () => {
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
			console.log(dateToUse);
			const response = await Axios.get(
				`/show/getShowByTheaterIdAndDate/${id}/${dateToUse}`
			);
			console.log(id);
			console.log(dateToUse);
			console.log(selectedDate);
			if (!response.data || response.data.length === 0) {
				setFilmsOrganizedByScreen(new Map());
				throw new Error("No data received from API");
			}
			const newGroupedFilms = new Map<string, Map<number, Film[]>>();
			response.data.forEach((theaterScreening: TheaterScreening) => {
				theaterScreening.films.forEach((film) => {
					if (!newGroupedFilms.has(film.name)) {
						newGroupedFilms.set(film.name, new Map());
					}
					const screens = newGroupedFilms.get(film.name);
					if (screens) {
						if (
							!screens.has(theaterScreening.screen.screen_number)
						) {
							screens.set(
								theaterScreening.screen.screen_number,
								[]
							);
						}
						screens
							.get(theaterScreening.screen.screen_number)
							?.push(film);
					}
				});
			});
			setFilmsOrganizedByScreen(newGroupedFilms);
			const theaters = await Promise.all(
				response.data.map(
					async (theaterScreening: TheaterScreening) => {
						const theater = await Axios.get(
							`/theater/getTheaterById/${theaterScreening.screen.theaterId}`
						);
						return theater.data;
					}
				)
			);

			const theater = theaters[0];
			theaterName = theater.name;
			setTheaterInfo(theater);
			console.log(theaterName);
		} catch (error) {
			console.error("Error fetching showtimes:", error);
		}
	};
	useEffect(() => {
		fetchShowtimes();
	}, [selectedDate, theaterId]);

	const isPastTime = (showDate: string, showTime: string): boolean => {
		console.log("Input Show Date:", showDate, "Input Show Time:", showTime);
		const timeParts = showTime.split(":");
		if (timeParts.length === 2) {
			showTime += ":00";
		} else if (timeParts.length < 2 || timeParts.length > 3) {
			console.error("Invalid time format:", showTime);
			return false;
		}
		const showDateTimeStr = `${showDate.slice(0, 10)}T${showTime}+07:00`;
		console.log(showDateTimeStr);
		const showDateTime = new Date(showDateTimeStr);
		console.log(showDateTime);
		console.log("Constructed Show DateTime:", showDateTime);
		if (isNaN(showDateTime.getTime())) {
			console.error("Invalid date or time value:", showDateTimeStr);
			return false;
		}
		const now = new Date();
		console.log("Current DateTime:", now);
		const result = now > showDateTime;
		console.log("Comparison result:", result);
		return result;
	};

	// const findNearestFutureTimeForScreen = (theaterScreening: TheaterScreening): NearestTime | null => {
	//     const now = new Date();
	//     let nearestTime = null;
	//     let minDiff = Number.MAX_SAFE_INTEGER;
	//     theaterScreening.films.forEach((film) => {
	//         const datePart = film.date.split("T")[0];
	//         const showDateTimeStr = `${datePart}T${film.startTime}`;
	//         const showDateTime = new Date(showDateTimeStr);
	//         console.log(showDateTime)
	//         const diff = showDateTime.getTime() - now.getTime();
	//         if (!isNaN(diff) && diff > 0 && diff < minDiff) {
	//             nearestTime = { date: film.date, startTime: film.startTime };
	//             minDiff = diff;
	//         }
	//     });
	//     return nearestTime;
	// };

	const findNearestFutureTimeForScreen = (
		films: Film[]
	): NearestTime | null => {
		const now = new Date();
		console.log(now);
		let nearestTime = null;
		let minDiff = Number.MAX_SAFE_INTEGER;
		films.sort((a, b) => {
			const timeA = new Date(`${a.date.split("T")[0]}T${a.startTime}`);
			const timeB = new Date(`${b.date.split("T")[0]}T${b.startTime}`);
			return timeA.getTime() - timeB.getTime();
		});

		films.forEach((film) => {
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
	return (
		<>
			<DateCarousel onDateSelect={handleDateSelect} />
			<Text style={TextStyle.h1} mb={4}>
				{theaterInfo.name}
			</Text>
			{[...filmsOrganizedByScreen.entries()].map(
				([filmName, screensMap], index) => (
					<VStack key={index} align="stretch" p={4}>
						<Flex
							direction={{ base: "column", md: "row" }}
							justify="space-around"
							align="center"
							mr="5vw">
							<Image
								src={
									screensMap.values().next().value[0]
										.posterImg
								}
								alt="Movie Poster"
								width={posterWidth}
								height={posterHeight}
								objectFit="cover"
								mr="1vw"
							/>
							<VStack
								align="stretch"
								spacing={3}
								flex="1"
								m={{ base: 4, md: 0 }}>
								<Text fontSize="lg" fontWeight="bold">
									{filmName}
								</Text>
								{[...screensMap.entries()].map(
									([screenNo, films], screenIndex) => {
										const nearestFutureTime =
											findNearestFutureTimeForScreen(
												films
											);
										return (
											<Box key={screenIndex}>
												<Text fontSize="md">
													Screen {screenNo} |{" "}
													{films[0].screenType} |{" "}
													{films[0].duration} mins
												</Text>
												<HStack spacing={4}>
													{films.map(
														(film, filmIndex) => {
															const isPast =
																isPastTime(
																	film.date,
																	film.startTime
																);
															const isNearest =
																nearestFutureTime &&
																nearestFutureTime.date ===
																	film.date &&
																nearestFutureTime.startTime ===
																	film.startTime;
															let buttonStyle =
																isPast
																	? notAvailableStyle
																	: isNearest
																	? nearestStyle
																	: futureStyle;
															return (
																// /Screen/:filmId/:date/:showId/:theaterId
																<Link
																	to={`/Screen/${film.filmId}/${film.date}/${film.showId}/${id}`}>
																	<Button
																		key={
																			filmIndex
																		}
																		size="sm"
																		style={
																			buttonStyle
																		}
																		isDisabled={
																			isPast
																		}>
																		{
																			film.startTime
																		}
																	</Button>
																</Link>
															);
														}
													)}
												</HStack>
											</Box>
										);
									}
								)}
							</VStack>
						</Flex>
					</VStack>
				)
			)}
		</>
	);
};
export default FilmInTheaterPage;
