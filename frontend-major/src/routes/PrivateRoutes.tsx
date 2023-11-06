import { RootLayout } from "../layouts/RootLayout";
import { Home } from "../pages/Home";

export const PrivateRoutes = () => {
  return {
    element: <RootLayout />,
    children: [{ path: "/", element: <Home /> }, { path: "/home2", element: <Home />}],
  };
};
