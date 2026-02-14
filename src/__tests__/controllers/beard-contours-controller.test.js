// Mocks explícitos via factory para evitar efeitos colaterais
jest.mock("../../services/upload-service", () => ({
	uploadToR2: jest.fn(),
	deleteFromR2: jest.fn(),
	sanitizeFileName: jest.fn((name) => name),
}));

jest.mock("../../repositories/beard-contours-repository", () => ({
	create: jest.fn(),
	get: jest.fn(),
	getById: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getByLabel: jest.fn(),
}));

jest.mock("../../utils/media", () => ({
	getVideoMetadata: jest.fn(),
}));

// Importar os módulos para poder acessar os mocks nos testes
const uploadService = require("../../services/upload-service");
const repository = require("../../repositories/beard-contours-repository");
const mediaUtils = require("../../utils/media");
const beardContoursController = require("../../controllers/beard-contours-controller");

describe("Beard Contours Controller", () => {
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
			await beardContoursController.uploadFile(req, res);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.send).toHaveBeenCalledWith({
				message: "Necessário enviar um arquivo de mídia",
			});
		});

		it("should upload file and create record successfully", async () => {
			req.file = {
				buffer: Buffer.from("test"),
				mimetype: "image/png",
				originalname: "test.png",
			};
			req.params.adminId = "admin123";
			req.body = { id: "1", label: "Contour 1", icon: "icon-1" };

			uploadService.uploadToR2.mockResolvedValue({
				key: "key-123",
				url: "http://public.url/key-123",
				bucket: "bucket-test",
			});

			mediaUtils.getVideoMetadata.mockResolvedValue({});

			repository.create.mockResolvedValue({
				...req.body,
				defaultImage: { url: "http://public.url/key-123" },
			});

			await beardContoursController.uploadFile(req, res);

			expect(uploadService.uploadToR2).toHaveBeenCalledWith(req.file);
			expect(repository.create).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.send).toHaveBeenCalledWith(
				expect.objectContaining({ message: "Upload criado!" }),
			);
		});
	});

	describe("listUploads", () => {
		it("should return list of uploads", async () => {
			const mockData = [{ id: "1", label: "Test" }];
			repository.get.mockResolvedValue(mockData);

			await beardContoursController.listUploads(req, res);

			expect(repository.get).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith(mockData);
		});
	});

	describe("getById", () => {
		it("should return item if found", async () => {
			const mockItem = { id: "1", label: "Test" };
			req.params.id = "1";
			repository.getById.mockResolvedValue(mockItem);

			await beardContoursController.getById(req, res);

			expect(repository.getById).toHaveBeenCalledWith("1");
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith(mockItem);
		});

		it("should return 404 if not found", async () => {
			req.params.id = "999";
			repository.getById.mockResolvedValue(null);

			await beardContoursController.getById(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.send).toHaveBeenCalledWith({ message: "Item não encontrado" });
		});
	});

	describe("update", () => {
		it("should update text fields without file", async () => {
			req.params.id = "1";
			req.body = { label: "Updated Label" };
			const mockItem = { id: "1", label: "Old Label" };

			repository.getById.mockResolvedValueOnce(mockItem);
			repository.getById.mockResolvedValueOnce({
				...mockItem,
				label: "Updated Label",
			});

			await beardContoursController.update(req, res);

			expect(repository.update).toHaveBeenCalledWith("1", {
				label: "Updated Label",
			});
			expect(uploadService.uploadToR2).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
		});

		it("should update file and delete old one if file provided", async () => {
			req.params.id = "1";
			req.file = { buffer: Buffer.from("new"), mimetype: "image/png" };

			const mockItem = {
				id: "1",
				defaultImage: { key: "old-key", url: "old-url" },
			};

			repository.getById.mockResolvedValue(mockItem);
			uploadService.uploadToR2.mockResolvedValue({
				key: "new-key",
				url: "new-url",
			});

			await beardContoursController.update(req, res);

			expect(uploadService.deleteFromR2).toHaveBeenCalledWith("old-key");
			expect(uploadService.uploadToR2).toHaveBeenCalled();
			expect(repository.update).toHaveBeenCalled();
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

			await beardContoursController.delete(req, res);

			expect(repository.delete).toHaveBeenCalledWith("1");
			expect(uploadService.deleteFromR2).toHaveBeenCalledWith("key-to-delete");
			expect(res.status).toHaveBeenCalledWith(200);
		});

		it("should return 404 if item to delete not found", async () => {
			req.params.id = "999";
			repository.delete.mockResolvedValue(null);

			await beardContoursController.delete(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(uploadService.deleteFromR2).not.toHaveBeenCalled();
		});
	});
});
