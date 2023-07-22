import createConnectionPool from "@databases/pg";
import { config } from "dotenv";
import { Client, Pool } from "pg";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const DB_Client = Client;

// exporting secret .env variables

export const {
	LOG_FORMAT,
	SECRET,
	PORT,
	DB_HOST,
	DB_PORT,
	DB_USER,
	DB_PASSWORD,
	DB_DATABASE,
	LOG_DIR,
	NODE_ENV,
} = process.env;

// initializing new postgres database client for database connection

export const db = new Pool({
	host: DB_HOST,
	port: Number(DB_PORT),
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_DATABASE,
});

export const dbConnPool = createConnectionPool(
	`postgres://${DB_USER}:${encodeURIComponent(
		DB_PASSWORD,
	)}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
);
