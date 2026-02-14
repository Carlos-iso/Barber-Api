jest.mock("../../services/upload-service", () => ({
	uploadToR2: jest.fn(),
	deleteFromR2: jest.fn(),
	sanitizeFileName: jest.fn((name) => name),
}));

jest.mock("../../repositories/cutting-methods-repository", () => ({
	create: jest.fn(),
	get: jest.fn(),
	getById: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getByLabel: jest.fn(), // CuttingMethods usa getByLabel
}));

jest.mock("../../utils/media", () => ({ getVideoMetadata: jest.fn() }));

const uploadService = require("../../services/upload-service");
const repository = require("../../repositories/cutting-methods-repository");
const mediaUtils = require("../../utils/media");
const controller = require("../../controllers/cutting-methods-controller");

describe("Cutting Methods Controller", () => {
	let req, res;
	beforeEach(() => {
		req = { params: {}, body: {}, file: undefined };
		res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
		jest.clearAllMocks();
	});

	describe("uploadFile", () => {
		it("should upload successfully with backgroundImage", async () => {
			req.file = {
				buffer: Buffer.from("t"),
				mimetype: "image/png",
				originalname: "t.png",
			};
			req.body = { label: "Method 1" }; // CuttingMethods usa label

			uploadService.uploadToR2.mockResolvedValue({
				key: "k",
				url: "u",
				bucket: "b",
			});
			mediaUtils.getVideoMetadata.mockResolvedValue({});

			// Verifica se o controller monta o objeto com backgroundImage
			const expectedUpload = expect.objectContaining({
				backgroundImage: expect.objectContaining({ url: "u", key: "k" }),
			});
			repository.create.mockResolvedValue({});

			await controller.uploadFile(req, res);

			expect(repository.create).toHaveBeenCalledWith(expectedUpload);
			expect(res.status).toHaveBeenCalledWith(201);
		});
	});

	describe("update", () => {
		it("should update backgroundImage", async () => {
			req.params.id = "1";
			req.file = { buffer: Buffer.from("new"), mimetype: "image/png" };
			const mockItem = { id: "1", backgroundImage: { key: "old-k" } }; // usa backgroundImage

			repository.getById.mockResolvedValue(mockItem);
			uploadService.uploadToR2.mockResolvedValue({
				key: "new-k",
				url: "new-url",
			});

			await controller.update(req, res);

			expect(uploadService.deleteFromR2).toHaveBeenCalledWith("old-k");
			expect(repository.update).toHaveBeenCalledWith(
				"1",
				expect.objectContaining({
					backgroundImage: expect.objectContaining({ key: "new-k" }),
				}),
			);
		});
	});

	describe("delete", () => {
		it("should delete image from R2 using backgroundImage key", async () => {
			req.params.id = "1";
			repository.delete.mockResolvedValue({
				id: "1",
				backgroundImage: { key: "del-k" },
			});

			await controller.delete(req, res);
			expect(uploadService.deleteFromR2).toHaveBeenCalledWith("del-k");
		});
	});
});
