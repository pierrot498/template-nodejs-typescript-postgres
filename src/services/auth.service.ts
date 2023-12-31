import { Token, TokenDecoded } from "@/interfaces/auth.interface";
import { Client, ClientAccount } from "@/interfaces/clients.interface";
import { logger } from "@/utils/logger";
import { SECRET, db } from "@config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { HttpException } from "@exceptions/HttpException";
import { isEmpty } from "@utils/util";

/**
 * @description Authentication service class used by Auth Controller.
 * Contains user authentication logic.
 */
class AuthService {
	/**
	 * @method signUp
	 * @param {Client} clientData
	 * @description registers new user
	 */
	public async signup(clientData: Client): Promise<Number> {
		if (isEmpty(clientData)) {
			logger.error("clientData is empty for signup");
			throw new HttpException(400, "userData is empty");
		}
		const isEmailTaken = await this.checkIfEmailTaken(clientData.email);
		if (isEmailTaken) {
			throw new HttpException(409, "Email already in use");
		}

		const client = await db.query({
			text: "select * from insert_client($1, $2, $3)",
			values: [
				clientData.name,
				clientData.email,
				bcrypt.hashSync(clientData.password, 8),
			],
		});
		return client.rows[0].insert_client;
	}

	/**
	 * @method login
	 * @param {ClientAccount} userData
	 * @description logs on an existing user
	 */
	public async login(clientData: ClientAccount): Promise<{
		statusCode: Number;
		response: { token: String };
		message: string;
	}> {
		const client = await db.query({
			text: "select * from get_password_client($1)",
			values: [clientData.email],
		});
		const passwordIsValid = bcrypt.compareSync(
			clientData.password,
			client.rows[0].get_password_client,
		);

		if (!passwordIsValid) {
			throw new HttpException(401, "Invalid credentials");
		}

		const res = await db.query({
			text: "select * from get_client_id($1)",
			values: [clientData.email],
		});

		const client_id = res.rows[0].get_client_id;

		const token = jwt.sign({ id: client_id }, SECRET || "default", {
			algorithm: "HS256",

			expiresIn: 86400, // 24 hours
		});

		return {
			response: { token: token },
			message: "Login successful",
			statusCode: 200,
		};
	}

	/**
	 * @method logout
	 * @param {accessToken} string
	 * @description logs out an existing client and should revoke jwt
	 */
	public async logout(accessToken: string): Promise<String> {
		await jwt.verify(accessToken, SECRET || "default");

		const res = await db.query({
			text: "select * from revoke_token($1)",
			values: [accessToken],
		});
		return "Success logout";
	}

	private async checkIfEmailTaken(email: String): Promise<boolean> {
		const res = await db.query({
			text: "select * from check_email_taken($1)",
			values: [email],
		});
		return res.rows[0].check_email_taken;
	}
}

export default AuthService;
