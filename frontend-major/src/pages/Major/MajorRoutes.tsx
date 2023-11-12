import ExamplePage from "./pages/ExamplePage";
import MoviePage from "./pages/Movies";
import MovieInformationPage from "./pages/MovieInformationPage";
import CinemasPage from "./pages/CinemasPage";

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
		{
			path: "/Movie",
			element: <MoviePage/>
		},
		{
			path: "/MovieInfo",
			element: <MovieInformationPage/>
		},
		{
			path: "/Cinema",
			element: <CinemasPage/>
		},
	];
};

export default ExampleRoutes;
