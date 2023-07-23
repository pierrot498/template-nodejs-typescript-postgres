import { logger } from "@/utils/logger";
import { db } from "@config";
import { HttpException } from "@exceptions/HttpException";
import { userData } from "@/interfaces/user.interface";

/**
 * @description User service class used by UserController.
 * Contains user profile management logic.
 */
class UserService {
	/**
	 * @method deleteUserById
	 * @param {Number} id
	 * @param {Number} client_id
	 * @return {Promise<String>} result
	 * @description deletes an existing user
	 */
	public async deleteUserById(id: Number, client_id: Number): Promise<String> {
		logger.info(
			`Delete user using id ${String(id)} and client id ${String(client_id)}`,
		);
		const result = await db.query({
			text: "select * from archive_user($1, $2)",
			values: [id, client_id],
		});

		return result;
	}

	/**
	 * @method insertUser
	 * @param {userData} userData
	 * @param {Number} client_id
	 * @return {Promise<int>} insert operation result
	 * @description inserts user record into database
	 */
	public async insertUser(userData: userData, client_id: Number): Promise<any> {
		logger.info(
			`Insert user with client ${client_id} and user email ${userData.email}`,
		);

		//Used to recreate the data needed for the insertion

		try {
			const result: string = await db.query({
				text: "select * from public.insert_user($1,$2,$3)",
				values: [client_id, userData.name, userData.email],
			});
			return result;
		} catch (e) {
			logger.error(
				`Insert user with client ${client_id} and user email ${userData.email} failed with error ${e.message}`,
			);

			throw new HttpException(500, "Failed to insert user.");
		}
	}

	/**
	 * @method updateUser
	 * @param {Number} user_id
	 * @param {userData} userData
	 * @param {Number} client_id
	 * @return {Promise<String>} update operation result
	 * @description updates existing user record in database
	 */
	public async updateUser(
		user_id: Number,
		userData: userData,
		client_id: Number,
	): Promise<String> {
		logger.info(`Update user with client id ${client_id}, user id ${user_id} `);

		//Used to recreate the data needed for the insertion
		const array: any[] = [user_id];
		const select = await db.query({
			text: "select * from public.get_user_by_client_id_by_id($1, $2)",
			values: [client_id, user_id],
		});

		if (select.rows.length === 0) {
			logger.error(
				`User not found with given user ID ${user_id}, client id ${client_id} and email ${userData.email}`,
			);
			throw new HttpException(404, "User not found (given user ID)");
		}

		if (!client_id || !user_id) {
			logger.error(
				`Invalid Input Data provided for update user with client id ${client_id}, user id ${user_id} and email ${userData.email}`,
			);
			throw new HttpException(400, "Invalid Input Data (not present)");
		}
		const user = select.rows[0];

		const update = await db.query({
			text: "select * from public.update_user_by_client_id_by_id($1,$2,$3,$4)",
			values: [
				client_id,
				user_id,
				userData.name || user.name,
				userData.email || user.email,
			],
		});
		if (update.rows[0].update_user === null) {
			logger.error(
				`User not found with given user ID ${user_id}, client id ${client_id} and email ${userData.email}}`,
			);
			throw new HttpException(404, "User not found (given user ID)");
		}

		return update;
	}

	/**
	 * @method findUserById
	 * @param {Request} id
	 * @param {Response} client_id
	 * @return {Promise<any>} findUser
	 * @description retrieves an existing user
	 */
	public async findUserById(id: Number, client_id: Number): Promise<any> {
		logger.info(
			`User searched for user ${Number(id)} and client id ${Number(client_id)}`,
		);

		const findUser = await db.query({
			text: "select * from get_user_json($1, $2)",
			values: [id, client_id],
		});
		return findUser;
	}

	/**
	 * @method findUserByName
	 * @param {string} name
	 * @param {Number} client_id
	 * @return {Promise<any>} findUserByName
	 * @description retrieves existing user from this particular client by name
	 */
	public async findUserByName(name: String, client_id: Number): Promise<any> {
		logger.info(
			`User searched for user with partial name ${name} and client id ${Number(
				client_id,
			)}`,
		);
		console.log([name, client_id]);
		const findUsers = await db.query({
			text: "select * from get_user_table_patial_match_by_name($1::varchar, $2::int)",
			values: [name as string, client_id],
		});

		return findUsers.rows;
	}
}

export default UserService;
