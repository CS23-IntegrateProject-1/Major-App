import ExamplePage from "./pages/ExamplePage";
import MoviePage from "./pages/Movies";

const ExampleRoutes = () => {
	return [
		{
			path: "/Example",
			element: <ExamplePage />
		},
		{
			path: "/Movie",
			element: <MoviePage/>
		}
	];
};

export default ExampleRoutes;
