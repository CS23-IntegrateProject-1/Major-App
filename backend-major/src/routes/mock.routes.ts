import { Router } from "express";
import MockController from "../controllers/mock.controller";

class MockRoutes {
    router = Router();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get("/helloworld", MockController.helloWorld);
        this.router.get(
            "/helloworld/:count",
            MockController.multipleHelloWorld
        );
        this.router.get("/mockdata", MockController.retrieveMockData);
    }
}

export default new MockRoutes().router;
