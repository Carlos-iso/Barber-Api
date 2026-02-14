jest.mock("../../services/upload-service", () => ({
	uploadToR2: jest.fn(),
	deleteFromR2: jest.fn(),
	sanitizeFileName: jest.fn((name) => name),
}));
jest.mock("../../repositories/beard-heights-repository", () => ({
	create: jest.fn(),
	get: jest.fn(),
	getById: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getByLabel: jest.fn(),
}));
jest.mock("../../utils/media", () => ({ getVideoMetadata: jest.fn() }));

const uploadService = require("../../services/upload-service");
const repository = require("../../repositories/beard-heights-repository");
const controller = require("../../controllers/beard-heights-controller");

describe("Beard Heights Controller", () => {
	let req, res;
	beforeEach(() => {
		req = { params: {}, body: {}, file: undefined };
		res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
		jest.clearAllMocks();
	});

	it("uploadFile should create with label and defaultImage", async () => {
		req.file = { buffer: Buffer.from("t"), mimetype: "image/png" };
		req.body = { label: "H1" };
		uploadService.uploadToR2.mockResolvedValue({ key: "k", url: "u" });
		repository.create.mockResolvedValue({});
		await controller.uploadFile(req, res);
		expect(repository.create).toHaveBeenCalledWith(
			expect.objectContaining({ label: "H1", defaultImage: expect.anything() }),
		);
		expect(res.status).toHaveBeenCalledWith(201);
	});

	it("update should switch image", async () => {
		req.params.id = "1";
		req.file = { buffer: Buffer.from("n"), mimetype: "image/png" };
		repository.getById.mockResolvedValue({
			id: "1",
			defaultImage: { key: "old" },
		});
		uploadService.uploadToR2.mockResolvedValue({ key: "new", url: "u" });
		await controller.update(req, res);
		expect(uploadService.deleteFromR2).toHaveBeenCalledWith("old");
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it("delete should remove image", async () => {
		req.params.id = "1";
		repository.delete.mockResolvedValue({
			id: "1",
			defaultImage: { key: "del" },
		});
		await controller.delete(req, res);
		expect(uploadService.deleteFromR2).toHaveBeenCalledWith("del");
		expect(res.status).toHaveBeenCalledWith(200);
	});
});
