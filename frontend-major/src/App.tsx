import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import ExampleRoutes from "./pages/Major/MajorRoutes";
import { NotFoundPage } from "./pages/fallbackPages/NotFoundPage";
import React from "react";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [...ExampleRoutes()]
	},
	{ path: "/*", element: <NotFoundPage /> }
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
