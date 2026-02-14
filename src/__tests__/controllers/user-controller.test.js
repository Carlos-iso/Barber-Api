jest.mock("../../services/upload-service", () => ({
	uploadToR2: jest.fn(),
	deleteFromR2: jest.fn(),
	sanitizeFileName: jest.fn((name) => name),
}));

jest.mock("../../repositories/user-repository", () => ({
	create: jest.fn(),
	get: jest.fn(),
	getById: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getByEmailExist: jest.fn(),
	authenticate: jest.fn(),
}));

jest.mock("../../services/auth-service", () => ({
	generateToken: jest.fn().mockResolvedValue("token"),
	decodeToken: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
	genSaltSync: jest.fn(),
	hash: jest.fn().mockResolvedValue("hashed_password"),
	compare: jest.fn().mockResolvedValue(true),
}));

const uploadService = require("../../services/upload-service");
const repository = require("../../repositories/user-repository");
const controller = require("../../controllers/user-controller");

describe("User Controller Refactored", () => {
	let req, res;
	beforeEach(() => {
		req = { params: {}, body: {}, file: undefined };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
			end: jest.fn(),
		};
		jest.clearAllMocks();
	});

	describe("post (Create User)", () => {
		it("should create user with profile fields and avatar", async () => {
			req.body = {
				name: "Barber",
				email: "b@b.com",
				password: "password123",
				bio: "Best barber",
				phone: "123",
			};
			req.file = { buffer: Buffer.from("img"), mimetype: "image/png" };

			repository.getByEmailExist.mockResolvedValue(null);
			uploadService.uploadToR2.mockResolvedValue({
				key: "avatar-key",
				url: "avatar-url",
			});
			repository.create.mockResolvedValue({});

			await controller.post(req, res);

			expect(uploadService.uploadToR2).toHaveBeenCalled();
			expect(repository.create).toHaveBeenCalledWith(
				expect.objectContaining({
					bio: "Best barber",
					avatar: { url: "avatar-url", key: "avatar-key" },
				}),
			);
			expect(res.status).toHaveBeenCalledWith(201);
		});
	});

	describe("update (Put User)", () => {
		it("should update profile and replace avatar", async () => {
			req.params.id = "1";
			req.body = { bio: "New Bio" };
			req.file = { buffer: Buffer.from("new"), mimetype: "image/png" };

			const mockUser = { id: "1", avatar: { key: "old-key" } };
			repository.getById.mockResolvedValue(mockUser);
			uploadService.uploadToR2.mockResolvedValue({
				key: "new-key",
				url: "new-url",
			});

			await controller.update(req, res);

			expect(uploadService.deleteFromR2).toHaveBeenCalledWith("old-key");
			expect(repository.update).toHaveBeenCalledWith(
				"1",
				expect.objectContaining({
					bio: "New Bio",
					avatar: { url: "new-url", key: "new-key" },
				}),
			);
			expect(res.status).toHaveBeenCalledWith(200);
		});
	});
});
