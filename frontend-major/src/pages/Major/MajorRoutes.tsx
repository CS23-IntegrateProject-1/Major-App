import ExamplePage from "./pages/ExamplePage";
import MoviePage from "./pages/Movies";
import MovieInformationPage from "./pages/MovieInformationPage";
import CinemasPage from "./pages/CinemasPage";
import ScreenPage from "./pages/ScreenPage";
import PendingOrderPage from "./pages/PendingOrderPage";
import FilmInTheaterPage from "./pages/FilmInTheaterPage";
import SuccessfulPage from "./pages/SuccessfulPage";
import FallBackPage from "./pages/FallBackPage";

const ExampleRoutes = () => {
  return [
    {
      path: "/Example",
      element: <ExamplePage />,
    },
    {
      path: "/",
      element: <MoviePage />,
    },
    {
      path: "/Movie",
      element: <MoviePage />,
    },
    {
      path: "/MovieInfo/:filmId",
      element: <MovieInformationPage />,
    },
    {
      path: "/Screen/:filmId/:date/:showId/:theaterId",
      element: <ScreenPage />,
    },
    {
      path: "/Cinema",
      element: <CinemasPage />,
    },
    {
      path: "/PendingOrder",
      element: <PendingOrderPage />,
    },
    {
      path: "/ShowtimeInTheater/:theaterId",
      element: <FilmInTheaterPage />,
    },
    {
      path: "/success",
      element: <SuccessfulPage />,
    },
    {
      path: "/fallback",
      element: <FallBackPage />,
    },
  ];
};

export default ExampleRoutes;
