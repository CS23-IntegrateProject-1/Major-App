import { Application } from "express";
import MockRoutes from "./mock.routes";
import router from "./film";
import theater from "./theatre";

class Routes {
	constructor(app: Application) {
		app.use("/api/mock", MockRoutes);
		app.use("/api/film", router);
		app.use("/film", router);
		app.use("/api/theater", theater);
		app.use("/theater", theater);
	}
}
export default Routes;
