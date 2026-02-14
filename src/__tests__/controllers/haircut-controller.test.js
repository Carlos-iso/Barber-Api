// Mocks explícitos via factory
jest.mock("../../services/upload-service", () => ({
	uploadToR2: jest.fn(),
	deleteFromR2: jest.fn(),
	sanitizeFileName: jest.fn((name) => name),
}));

jest.mock("../../repositories/haircut-repository", () => ({
	create: jest.fn(),
	get: jest.fn(),
	getById: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getByName: jest.fn(), // Haircut usa getByName
}));

jest.mock("../../utils/media", () => ({
	getVideoMetadata: jest.fn(),
}));

const uploadService = require("../../services/upload-service");
const repository = require("../../repositories/haircut-repository");
const mediaUtils = require("../../utils/media");
const controller = require("../../controllers/haircut-controller");

describe("Haircut Controller", () => {
	let req, res;

	beforeEach(() => {
		req = {
			params: {},
			body: {},
			file: undefined,
		};
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		jest.clearAllMocks();
	});

	describe("uploadFile", () => {
		it("should return 400 if no file is provided", async () => {
			await controller.uploadFile(req, res);
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it("should upload file and create record successfully", async () => {
			req.file = {
				buffer: Buffer.from("test"),
				mimetype: "image/png",
				originalname: "test.png",
			};
			req.params.adminId = "admin123";
			req.body = { id: "1", name: "Cut 1", icon: "icon-1" }; // Haircut usa name

			uploadService.uploadToR2.mockResolvedValue({
				key: "key-123",
				url: "http://url/key",
				bucket: "bucket",
			});
			mediaUtils.getVideoMetadata.mockResolvedValue({});
			repository.create.mockResolvedValue({
				...req.body,
				defaultImage: { url: "http://url/key" },
			});

			await controller.uploadFile(req, res);

			expect(uploadService.uploadToR2).toHaveBeenCalledWith(req.file);
			expect(repository.create).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(201);
		});
	});

	describe("listUploads", () => {
		it("should return list of uploads", async () => {
			const mockData = [{ id: "1", name: "Test" }];
			repository.get.mockResolvedValue(mockData);

			await controller.listUploads(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith(mockData);
		});
	});

	describe("getById", () => {
		it("should return item if found", async () => {
			const mockItem = { id: "1", name: "Test" };
			req.params.id = "1";
			repository.getById.mockResolvedValue(mockItem);

			await controller.getById(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith(mockItem);
		});

		it("should return 404 if not found", async () => {
			req.params.id = "999";
			repository.getById.mockResolvedValue(null);
			await controller.getById(req, res);
			expect(res.status).toHaveBeenCalledWith(404);
		});
	});

	describe("update", () => {
		it("should update text fields", async () => {
			req.params.id = "1";
			req.body = { name: "Updated Name" }; // Haircut usa name
			const mockItem = { id: "1", name: "Old Name" };
			repository.getById.mockResolvedValueOnce(mockItem);
			repository.getById.mockResolvedValueOnce({
				...mockItem,
				name: "Updated Name",
			});

			await controller.update(req, res);
			expect(repository.update).toHaveBeenCalledWith("1", {
				name: "Updated Name",
			});
			expect(res.status).toHaveBeenCalledWith(200);
		});

		it("should update file and delete old one", async () => {
			req.params.id = "1";
			req.file = { buffer: Buffer.from("new"), mimetype: "image/png" };
			const mockItem = { id: "1", defaultImage: { key: "old-key" } };

			repository.getById.mockResolvedValue(mockItem);
			uploadService.uploadToR2.mockResolvedValue({
				key: "new-key",
				url: "new-url",
			});

			await controller.update(req, res);
			expect(uploadService.deleteFromR2).toHaveBeenCalledWith("old-key");
			expect(res.status).toHaveBeenCalledWith(200);
		});
	});

	describe("delete", () => {
		it("should delete record and image", async () => {
			req.params.id = "1";
			const mockDeletedItem = {
				id: "1",
				defaultImage: { key: "key-to-delete" },
			};
			repository.delete.mockResolvedValue(mockDeletedItem);

			await controller.delete(req, res);
			expect(repository.delete).toHaveBeenCalledWith("1");
			expect(uploadService.deleteFromR2).toHaveBeenCalledWith("key-to-delete");
			expect(res.status).toHaveBeenCalledWith(200);
		});

		it("should return 404 if not found", async () => {
			req.params.id = "999";
			repository.delete.mockResolvedValue(null);
			await controller.delete(req, res);
			expect(res.status).toHaveBeenCalledWith(404);
		});
	});
});
