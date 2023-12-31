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
	it("POST /user should create user and return status 200", async (): Promise<void> => {
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
	it("POST /user should create user and return status 400 when not setting right email", async (): Promise<void> => {
		const response = await request(app)
			.post("/user")
			.send({
				name: "paul",
				email: "client",
			})
			.set("Authorization", `Bearer ${token}`);
		expect(response.body.message).toStrictEqual("Valid email not provided.");
		expect(response.statusCode).toBe(400);
		app.close();
	});

	it("POST /user should create user and return status 401 when not setting right bearer token", async (): Promise<void> => {
		const response = await request(app)
			.post("/user")
			.send({
				name: "paul",
				email: "client",
			})
			.set("Authorization", `Bearer ${token + "t"}`);
		expect(response.body.message).toStrictEqual("Invalid access token");
		expect(response.statusCode).toBe(401);
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
		expect(response.body).toStrictEqual({ message: "Successfuly updated" });
		expect(response.statusCode).toBe(200);
		app.close();
	});

	it("PUT /user/:id should update user and return status 400 as it is an invalid email provided", async (): Promise<void> => {
		const response = await request(app)
			.put("/user/" + id)
			.send({
				name: "paul1",
				email: "client",
			})
			.set("Authorization", `Bearer ${token}`);
		expect(response.body.message).toStrictEqual("Valid email not provided.");
		expect(response.statusCode).toBe(400);
		app.close();
	});

	it("GET /user/:id should get information from the user", async (): Promise<void> => {
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

	it("GET /user/:id should return status 404 when providing wrong id", async (): Promise<void> => {
		const response = await request(app)
			.get("/user/" + 150)
			.send()
			.set("Authorization", `Bearer ${token}`);

		expect(response.body.message).toStrictEqual(
			`User not found (user_ID: ${150})`,
		);

		expect(response.statusCode).toBe(404);
		app.close();
	});
	it("GET /user/:id should return status 400 when providing id as string", async (): Promise<void> => {
		const response = await request(app)
			.get("/user/tes")
			.send()
			.set("Authorization", `Bearer ${token}`);

		expect(response.body.message).toStrictEqual(
			`Invalid Input Data (not present)`,
		);

		expect(response.statusCode).toBe(400);
		app.close();
	});
	it("GET /user?username=u should return status 200 when providing part of a inserted name", async (): Promise<void> => {
		const response = await request(app)
			.get("/user?username=u")
			.send()
			.set("Authorization", `Bearer ${token}`);

		expect(response.body.message).toStrictEqual("Sent (user name like: u)");
		expect(response.body.data[0].name).toStrictEqual("paul1");
		expect(response.body.data[0].email).toStrictEqual("client@gmail.com");
		expect(response.statusCode).toBe(200);
		app.close();
	});
	it("GET /user?username=a should return status 404 when providing part of a unexisting user name", async (): Promise<void> => {
		const response = await request(app)
			.get("/user?username=aa")
			.send()
			.set("Authorization", `Bearer ${token}`);

		expect(response.body).toStrictEqual({
			message: "User not found (user name like: aa)",
			username: "aa",
			data: null,
		});

		expect(response.statusCode).toBe(404);
		app.close();
	});

	it("DELETE /user/:id should delete user and return status 200", async (): Promise<void> => {
		const response = await request(app)
			.delete("/user/" + id)
			.send()
			.set("Authorization", `Bearer ${token}`);
		expect(response.body).toStrictEqual({
			message: "Deleted (user_ID: " + id + ")",
			user_id: id,
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
