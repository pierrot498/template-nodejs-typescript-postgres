import { HttpException } from "@/exceptions/HttpException";
import { clientSignup, clientLogin } from "@/schemas/auth.schemas";

import { logger } from "@/utils/logger";
import { Client, ClientAccount } from "@interfaces/clients.interface";
import AuthService from "@services/auth.service";
import { NextFunction, Request, Response } from "express";
/**
 * @description Authentication controller class
 * Contains client authentication management logic.
 */
class AuthController {
	public authService = new AuthService();
	/**
	 * @method signUp
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @description registers new client
	 */
	public signUp = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<any> => {
		try {
			try {
				await clientSignup.validate(req.body);
			} catch (e) {
				logger.error("Invalid Input Data for inserting user");
				throw new HttpException(400, e.message);
			}
			const clientAuth = new AuthService();
			const user: Client = req.body;
			const signUpUserData = await clientAuth.signup(user);
			res
				.status(201)
				.json({ data: signUpUserData, message: "Signup Successful" });
		} catch (error) {
			next(error);
		}
	};

	/**
	 * @method login
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @description logs on an existing client
	 */
	public logIn = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<any> => {
		try {
			try {
				await clientLogin.validate(req.body);
			} catch (e) {
				logger.error("Invalid Input Data for inserting user");
				throw new HttpException(400, e.message);
			}
			const clientAuth = new AuthService();
			const client: ClientAccount = req.body;
			console.log(client);
			const result = await clientAuth.login(client);
			res.status(Number(result.statusCode)).json(result.response);
		} catch (error) {
			next(error);
		}
	};
	/**
	 * @method logout
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @description logs out an existing client
	 */
	public logOut = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<any> => {
		try {
			const clientAuth = new AuthService();
			const accessToken: string = res.locals.token;
			const result = await clientAuth.logout(accessToken);
			res.status(200).json({ message: "Logout successful" });
		} catch (error) {
			if (error.message == "Access Token has been revoked")
				res.status(403).json({ message: error.message });
			if (error.message == "Invalid Access Token")
				res.status(401).json({ message: error.message });
			next(error);
		}
	};
}

export default AuthController;
