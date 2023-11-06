import { Application } from "express";
import MockRoutes from "./mock.routes";

class Routes {
	constructor(app: Application) {
		app.use("/api/mock", MockRoutes);
	}
}
export default Routes;
