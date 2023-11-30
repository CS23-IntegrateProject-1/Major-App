import ExamplePage from "./pages/ExamplePage";
import MoviePage from "./pages/Movies";
import MovieInformationPage from "./pages/MovieInformationPage";
import CinemasPage from "./pages/CinemasPage";
import ScreenPage from "./pages/ScreenPage";
import PendingOrderPage from "./pages/PendingOrderPage";
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
			path: "/Screen/:filmId/:date/:showId/:theaterId",
			element: <ScreenPage/>

		},
		{
			path: "/Cinema",
			element: <CinemasPage/>
		},
		{
			path: "/PendingOrder",
			element: <PendingOrderPage/>
		},
	];
};

export default ExampleRoutes;
