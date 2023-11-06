import { Request, Response } from "express";
import MockService from "../services/mock.service";

interface IMockController {
	helloWorld(req: Request, res: Response): Promise<void>;
	multipleHelloWorld(req: Request, res: Response): Promise<void>;
	retrieveMockData(req: Request, res: Response): Promise<void>;
}

class MockController implements IMockController {
	async helloWorld(req: Request, res: Response): Promise<void> {
		const data = await MockService.helloWorld();
		res.status(200).send(data);
	}

	async multipleHelloWorld(req: Request, res: Response): Promise<void> {
		const count = parseInt(req.params.count);
		const dataSet: any[] = [];
		for (let i = 0; i < count; i++) {
			const data = await MockService.helloWorld();
			dataSet.push(data);
		}
		res.status(200).send(dataSet);
	}

	async retrieveMockData(req: Request, res: Response): Promise<void> {
		const data = await MockService.mockData();
		res.status(200).send(data);
	}
}

export default new MockController();
