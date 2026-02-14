jest.mock("../../repositories/service-order-repository.js", () => ({
	create: jest.fn(),
	get: jest.fn(),
	getById: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
}));

const repository = require("../../repositories/service-order-repository.js");
const controller = require("../../controllers/service-order-controller.js");

describe("Service Order Controller", () => {
	let req, res;
	beforeEach(() => {
		req = {
			params: {},
			body: {},
			user: { id: "barber123" }, // Simula usuário logado via token
		};
		res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
		jest.clearAllMocks();
	});

	it("should create service order with valid data", async () => {
		req.body = {
			customerName: "Customer",
			totalPrice: 50,
			date: new Date(),
			status: "pending",
			services: [{ name: "Cut", price: 50 }],
		};
		repository.create.mockResolvedValue({});

		await controller.post(req, res);

		expect(repository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				customerName: "Customer",
				barberId: "barber123",
			}),
		);
		expect(res.status).toHaveBeenCalledWith(201);
	});

	it("should list service orders for logged barber", async () => {
		repository.get.mockResolvedValue([]);
		await controller.get(req, res);
		expect(repository.get).toHaveBeenCalledWith("barber123");
		expect(res.status).toHaveBeenCalledWith(200);
	});
});
