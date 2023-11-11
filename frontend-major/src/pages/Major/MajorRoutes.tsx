import ExamplePage from "./pages/ExamplePage";
import MoviePage from "./pages/Movies";
import MovieInformationPage from "./pages/MovieInformationPage";

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
		}
	];
};

export default ExampleRoutes;
