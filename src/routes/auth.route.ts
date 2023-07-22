import AuthController from "@controllers/auth.controller";

import { Routes } from "@interfaces/routes.interface";
import { Router } from "express";

/**
 * @description The AuthRoute class implements Routes and
 * exposes endpoints for user authentication.
 */
class AuthRoute implements Routes {
	public path = "/";
	public router = Router();
	public authController = new AuthController();
	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(`${this.path}signup`, this.authController.signUp);
		this.router.post(`${this.path}login`, this.authController.logIn);
		this.router.post(`${this.path}logout`, this.authController.logOut);
	}
}

export default AuthRoute;
