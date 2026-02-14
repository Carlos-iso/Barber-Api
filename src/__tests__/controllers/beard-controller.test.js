// Mocks
jest.mock("../../services/upload-service", () => ({
	uploadToR2: jest.fn(),
	deleteFromR2: jest.fn(),
	sanitizeFileName: jest.fn((name) => name),
}));

jest.mock("../../repositories/beard-repository", () => ({
	create: jest.fn(),
	get: jest.fn(),
	getById: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getByName: jest.fn(), // Beard usa getByName
}));

jest.mock("../../utils/media", () => ({
	getVideoMetadata: jest.fn(),
}));

const uploadService = require("../../services/upload-service");
const repository = require("../../repositories/beard-repository");
const mediaUtils = require("../../utils/media");
const controller = require("../../controllers/beard-controller");

describe("Beard Controller", () => {
	let req, res;

	beforeEach(() => {
		req = { params: {}, body: {}, file: undefined };
		res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
		jest.clearAllMocks();
	});

	describe("uploadFile", () => {
		it("should return 400 if no file", async () => {
			await controller.uploadFile(req, res);
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it("should upload successfully", async () => {
			req.file = {
				buffer: Buffer.from("t"),
				mimetype: "image/png",
				originalname: "t.png",
			};
			req.params.adminId = "1";
			req.body = { id: "1", name: "Beard 1" }; // Beard usa name

			uploadService.uploadToR2.mockResolvedValue({
				key: "k",
				url: "u",
				bucket: "b",
			});
			mediaUtils.getVideoMetadata.mockResolvedValue({});
			repository.create.mockResolvedValue({ ...req.body });

			await controller.uploadFile(req, res);
			expect(res.status).toHaveBeenCalledWith(201);
		});
	});

	// ... Outros testes seguem o padrão (list, getById, delete) ...
	// Simplificando mocks para os repetitivos, focando nas diferenças

	describe("update", () => {
		it("should update name", async () => {
			req.params.id = "1";
			req.body = { name: "New Name" }; // Beard usa name
			repository.getById.mockResolvedValue({ id: "1", name: "Old" });
			await controller.update(req, res);
			expect(repository.update).toHaveBeenCalledWith("1", { name: "New Name" });
		});
	});

	describe("delete", () => {
		it("should delete", async () => {
			req.params.id = "1";
			repository.delete.mockResolvedValue({
				id: "1",
				defaultImage: { key: "k" },
			});
			await controller.delete(req, res);
			expect(uploadService.deleteFromR2).toHaveBeenCalledWith("k");
			expect(res.status).toHaveBeenCalledWith(200);
		});
	});
});
