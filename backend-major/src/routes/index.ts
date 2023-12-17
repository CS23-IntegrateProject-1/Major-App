import { Application } from "express";
import MockRoutes from "./mock.routes";
import router from "./film";
import theater from "./theatre";
import show from "./show";
import screen from "./screen";
import seat from "./seat";
import payment from "./payment";

class Routes {
	constructor(app: Application) {
		app.use("/api/mock", MockRoutes);
		app.use("/api/film", router);
		app.use("/film", router);
		app.use("/api/theater", theater);
		app.use("/theater", theater);
		app.use("/api/show", show);
		app.use("/show", show);
		app.use("/api/screen", screen);
		app.use("/screen", screen);
		app.use("/api/seat", seat);
		app.use("/seat", seat);
		app.use("/api/payment", payment);
		app.use("/payment", payment);
	}
}
export default Routes;
