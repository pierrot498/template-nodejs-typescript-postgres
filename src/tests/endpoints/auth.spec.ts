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

const token = "";

afterAll(async () => {
	await new Promise((resolve) => setTimeout(() => resolve(true), 4000)); // avoid jest open handle error
	const drop_clients = "TRUNCATE clients CASCADE;";
	await callSQLStatement(drop_clients);
});
describe("Auth", (): void => {
	it("POST /signup clients", async (): Promise<void> => {
		const response = await request(app).post("/signup").send({
			name: "paul",
			email: "client@gmail.com",
			password: "testclient50",
		});
		expect(response.body.message).toStrictEqual("Signup Successful");
		expect(response.statusCode).toBe(201);
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
