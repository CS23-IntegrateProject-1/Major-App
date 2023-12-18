import { useEffect, useState } from "react";
import { Box, Grid, useBreakpointValue } from "@chakra-ui/react";
import { MovieCard } from "../../../components/movieCard/moviecard";
import {
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	TabIndicator,
} from "@chakra-ui/react";
import { Axios } from "../../../AxiosInstance";

const MoviePage = () => {
	const [nowShowingMovies, setNowShowingMovies] = useState([]);
	const [upcommingMovies, setUpcommingMovies] = useState([]);

	useEffect(() => {
		Axios.get("/film/getCurrentFilm")
			.then((response) => {
				setNowShowingMovies(response.data);
			})
			.catch((error) => {
				console.error("Error fetching now showing movies:", error);
			});
	}, []);
	useEffect(() => {
		Axios.get("/film/getUpcomingFilm")
			.then((response) => {
				setUpcommingMovies(response.data);
			})
			.catch((error) => {
				console.error("Error fetching now showing movies:", error);
			});
	}, []);

	const columns =
		useBreakpointValue<number>({ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }) ||
		1;

	return (
		<Box justifyContent="center" textAlign="center" alignItems="center">
			{/* Tab details and show */}
			<Tabs isFitted position="relative" variant="unstyled">
				<TabList>
					<Tab _selected={{ color: "gold" }}>Now Showing</Tab>
					<Tab _selected={{ color: "gold" }}>Upcoming</Tab>
				</TabList>
				<TabIndicator
					mt="-1.5px"
					height="2px"
					bg="gold"
					borderRadius="1px"
				/>
				<TabPanels>
					<TabPanel>
						<Grid
							templateColumns={`repeat(auto-fill, minmax(calc(${
								100 / columns
							}% - 20px), 1fr))`} // Adjust the column width here
							gap={2} // Adjust the gap between grid items
							justifyContent="center">
							{nowShowingMovies.map((film) => (
								<Box key={film} marginBottom={4}>
									<MovieCard film={film} />
								</Box>
							))}
						</Grid>
					</TabPanel>
					<TabPanel>
						<Grid
							templateColumns={`repeat(auto-fill, minmax(calc(${
								100 / columns
							}% - 20px), 1fr))`} // Adjust the column width here
							gap={2} // Adjust the gap between grid items
							justifyContent="center">
							{upcommingMovies.map((film) => (
								<Box key={film} marginBottom={4}>
									<MovieCard film={film} />
								</Box>
							))}
						</Grid>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
};

export default MoviePage;
