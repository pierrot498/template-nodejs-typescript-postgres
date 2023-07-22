import { userSchema, updateUserSchema } from "@/schemas/user.schemas";
import { logger } from "@/utils/logger";
import { HttpException } from "@exceptions/HttpException";
import { userData } from "@/interfaces/user.interface";
import UserService from "@services/user.service";
import { NextFunction, Request, Response } from "express";
/**
 * @description User User controller class
 * Contains user  profile record management logic.
 */
class UserUserController {
	public userService = new UserService();

	/**
	 * @method deleteUser
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @description deletes an existing user
	 */
	public deleteUser = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		let result: string = null;
		let message: string;
		let code = 0;
		try {
			console.log(req.params);

			const id: Number = Number(req.params.user_id);
			const client_id = Number(res.locals.client_id);
			const row: any = await this.userService.deleteUserById(id, client_id);
			if (row.rowCount > 0) {
				const returned_result = row.rows[0].archive_user;
				if (returned_result === "user__profiles_not_found") {
					code = 404;
					message = "User not found (user_ID: null)";
				} else if (returned_result === null) {
					code = 404;
					message = "User not found (user_ID: null)";
				} else if (returned_result === "user__has_minted_dboe") {
					code = 400;
					message = "Invalid Input Data (not present)";
				} else {
					code = 200;
					result = returned_result;
					message = `Deleted (user_ID: ${returned_result})`;
				}
			}

			res.status(code).json({ message: message, user_id: result });
		} catch (error) {
			next(error);
		}
	};

	/**
	 * @method insertUser
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @description creates a new user record
	 */
	public insertUser = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			try {
				await userSchema.validate(req.body);
			} catch (e) {
				logger.error("Invalid Input Data for inserting ");
				throw new HttpException(400, e.message);
			}
			const user: userData = req.body;
			const client_id = res.locals.client_id;
			const registerData: any = await this.userService.insertUser(
				user,
				client_id,
			);
			const result = registerData.rows[0].insert_user;
			res
				.status(200)
				.json({ user_id: result, message: "Successfully registered" });
		} catch (error) {
			next(error);
		}
	};

	/**
	 * @method updateUser
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @description updates an existing user record
	 */
	public updateUser = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			try {
				await updateUserSchema.validate(req.body);
			} catch (e) {
				logger.error("Invalid Input Data for updating ");
				throw new HttpException(400, e.message);
			}

			const client_id = Number(res.locals.client_id);
			const user_id = Number(req.params.user_id);
			req.body.user_id = user_id;
			const user: userData = req.body;
			const registerData: any = await this.userService.updateUser(
				user_id,
				user,
				client_id,
			);
			const result = registerData.rows[0].update_user;

			res.status(200).json({ message: result });
		} catch (error) {
			if (error.message == "Account id is not related to this user") {
				res
					.status(409)
					.json({ message: "Account id is not related to current user" });
			} else {
				next(error);
			}
		}
	};
}

export default UserUserController;
