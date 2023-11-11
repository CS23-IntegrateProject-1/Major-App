import { Application } from "express";
import MockRoutes from "./mock.routes";
import router from "./film";
import theater from "./theatre";
import show from "./show";

class Routes {
	constructor(app: Application) {
		app.use("/api/mock", MockRoutes);
		app.use("/api/film", router);
		app.use("/film", router);
		app.use("/api/theater", theater);
		app.use("/theater", theater);
		app.use("/api/show", show);
		app.use("/show", show);
	}
}
export default Routes;
