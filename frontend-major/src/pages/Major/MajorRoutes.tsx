import ExamplePage from "./pages/ExamplePage";
import MoviePage from "./pages/Movies";
import MovieInformationPage from "./pages/MovieInformationPage";
import CinemasPage from "./pages/CinemasPage";
// import UpcomingMovie from "./pages/UpcomingMovie";

const ExampleRoutes = () => {
	return [
		{
			path: "/Example",
			element: <ExamplePage />
		},
		{
			path: "/",
			element: <MoviePage/>
		},
		// {
		// 	path: "/upComing",
		// 	element: <UpcomingMovie/>
		// },
		{
			path: "/Movie",
			element: <MoviePage/>
		},
		{
			path: "/MovieInfo/:filmId",
			element: <MovieInformationPage/>
		},
		{
			path: "/Cinema",
			element: <CinemasPage/>
		},
	];
};

export default ExampleRoutes;
