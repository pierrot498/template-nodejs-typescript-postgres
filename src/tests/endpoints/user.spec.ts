import { expect } from "@jest/globals";
import request from "supertest";
import app from "../../server";
import {
	DB_Client,
	DB_DATABASE,
	DB_HOST,
	DB_PASSWORD,
	DB_PORT,
	DB_USER,
} from "@config";

let token = "";
let id: Number;
beforeEach(async () => {
	await request(app).post("/signup").send({
		name: "paul",
		email: "client@gmail.com",
		password: "testclient50",
	});
	const res = await request(app).post("/login").send({
		email: "client@gmail.com",
		password: "testclient50",
	});
	token = res.body.token;
});
afterAll(async () => {
	await new Promise((resolve) => setTimeout(() => resolve(true), 4000)); // avoid jest open handle error
	const drop_clients = "TRUNCATE clients CASCADE;";
	await callSQLStatement(drop_clients);
	const drop_users = "TRUNCATE users CASCADE;";
	await callSQLStatement(drop_users);
});
describe("Auth", (): void => {
	it("POST /user should create user and return 200", async (): Promise<void> => {
		const response = await request(app)
			.post("/user")
			.send({
				name: "paul",
				email: "client@gmail.com",
			})
			.set("Authorization", `Bearer ${token}`);
		expect(response.body.message).toStrictEqual("Successfully registered");
		expect(response.statusCode).toBe(200);
		id = response.body.user_id;
		app.close();
	});

	it("PUT /user/:id should update user and return 200", async (): Promise<void> => {
		const response = await request(app)
			.put("/user/" + id)
			.send({
				name: "paul1",
				email: "client@gmail.com",
			})
			.set("Authorization", `Bearer ${token}`);
		expect(response.body).toStrictEqual({});
		expect(response.statusCode).toBe(200);
		app.close();
	});

	it("GET /user/1 should get information from the user", async (): Promise<void> => {
		const response = await request(app)
			.get("/user/" + id)
			.send()
			.set("Authorization", `Bearer ${token}`);

		expect(response.body.message).toStrictEqual("Sent (user_ID: " + id + ")");
		expect(response.body.user_id).toStrictEqual(id);
		expect(response.body.data.name).toStrictEqual("paul1");
		expect(response.body.data.email).toStrictEqual("client@gmail.com");
		expect(response.statusCode).toBe(200);
		app.close();
	});

	it("DELETE /user/:id should delete user and return 200", async (): Promise<void> => {
		const response = await request(app)
			.delete("/user/" + id)
			.send()
			.set("Authorization", `Bearer ${token}`);
		expect(response.body).toStrictEqual({
			message: "Deleted (user_ID: Archived)",
			user_id: "Archived",
		});
		expect(response.statusCode).toBe(200);
		app.close();
	});
});

const callSQLStatement = async (sql: string) => {
	const pgclient = new DB_Client({
		host: DB_HOST,
		port: DB_PORT,
		user: DB_USER,
		password: DB_PASSWORD,
		database: DB_DATABASE,
	});
	await pgclient.connect();
	await pgclient.query(sql);
	await pgclient.end();
};
