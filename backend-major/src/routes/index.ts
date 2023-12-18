import { Application } from "express";
import film from "./film.routes";
import theater from "./theatre.routes";
import show from "./show.routes";
import screen from "./screen.routes";
import seat from "./seat.routes";
import payment from "./payment.routes";
import reservation from "./reservation.routes";

class Routes {
	constructor(app: Application) {
		app.use("/api/film", film);
		app.use("/film", film);
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
		app.use("/reservation", reservation);
		app.use("/api/reservation", reservation);
	}
}
export default Routes;
