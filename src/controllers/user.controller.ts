import { userSchema, updateUserSchema } from "@/schemas/user.schemas";
import { logger } from "@/utils/logger";
import { HttpException } from "@exceptions/HttpException";
import { userData } from "@/interfaces/user.interface";
import UserService from "@services/user.service";
import { NextFunction, Request, Response } from "express";
/**
 * @description User controller class
 * Contains user profile record management logic.
 */
class UserController {
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
			const id: Number = Number(req.params.user_id);
			const client_id = Number(res.locals.client_id);
			const row: any = await this.userService.deleteUserById(id, client_id);
			if (row.rowCount > 0) {
				const returned_result = row.rows[0].archive_user;

				code = 200;
				result = returned_result;
				message = `Deleted (user_ID: ${returned_result})`;
			} else {
				code = 404;
				message = `User not found`;
			}

			res.status(code).json({ message: message, user_id: Number(result) });
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

			res.status(200).json({ message: "Successfuly updated" });
		} catch (error) {
			next(error);
		}
	};

	/**
	 * @method getUser
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @description retrieves an existing user
	 */
	public getUser = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		let message: string;

		const user_id = req.params.user__id;
		let code = 0;
		let data: any = null;
		try {
			const client_id = Number(res.locals.client_id);
			const user_id = Number(req.params.user_id);
			if (user_id > 0) {
				const findUserData: any = await this.userService.findUserById(
					user_id,
					client_id,
				);
				const json_text = findUserData.rows[0].get_user_json;

				if (json_text != null) {
					code = 200;
					data = JSON.parse(json_text);
					message = `Sent (user_ID: ${user_id})`;
				} else {
					code = 404;
					message = `User not found (user_ID: ${user_id})`;
				}
			} else {
				code = 400;
				message = "Invalid Input Data (not present)";
			}
			res.status(code).json({ message, user_id, data });
		} catch (error) {
			next(error);
		}
	};
}

export default UserController;
