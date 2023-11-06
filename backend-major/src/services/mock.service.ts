import { PrismaClient } from "@prisma/client";

interface IMockService {
	helloWorld(): Promise<string>;
}

class MockService implements IMockService {
	helloWorld(): Promise<string> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve("Hello World!");
			}, 1000); // wait 1 second and then resolve
		});
	}

	mockData(): Promise<string[]> {
		const mockData = ["Hello", "World", "From", "The", "Mock", "Service"];
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(mockData);
			}, 1000); // wait 1 second and then resolve
		});
	}

	async getTheaters(): Promise<any[]> {
		const prisma = new PrismaClient();
		return await prisma.theaters.findMany();
	}
}

export default new MockService();
