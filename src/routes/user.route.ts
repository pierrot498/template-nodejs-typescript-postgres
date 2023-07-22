import UserController from "@/controllers/user.controller";
import { Routes } from "@interfaces/routes.interface";
import { Router } from "express";

/**
 * @description The UserRoute class implements Routes and
 * exposes endpoints for user operations,
 * i.e., delete, insert and update user
 * and delete users.
 */
class UserRoute implements Routes {
	public path = "/user";
	public router = Router();
	public userController = new UserController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}/:user_id`, this.userController.getUser);
		this.router.post(`${this.path}`, this.userController.insertUser);
		this.router.put(`${this.path}/:user_id`, this.userController.updateUser);

		this.router.delete(`${this.path}/:user_id`, this.userController.deleteUser);
	}
}

export default UserRoute;
