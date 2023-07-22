import { LOG_FORMAT, NODE_ENV, PORT } from "@config";
import { Routes } from "@interfaces/routes.interface";
import authenticate from "@middlewares/authenticate.middleware";
import errorMiddleware from "@middlewares/error.middleware";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import { logger } from "./utils/logger";

process.on("uncaughtException", (err) => {
	logger.error(`Uncaught Exception: ${err.message}`);
	process.exit(1);
});
class App {
	public app: express.Application;
	public env: string;
	public port: string | number;

	constructor(routes: Routes[]) {
		try {
			this.app = express();
			this.env = NODE_ENV || "development";
			this.port = PORT || 3000;

			this.initializeMiddlewares();
			this.initializeRoutes(routes);
			this.initializeErrorHandling();
		} catch (e) {
			console.log(e);
		}
	}

	public listen() {
		return this.app.listen(this.port, () => {
			logger.info(`App listening on the port ${this.port}`);
			console.log(`=================================`);
			console.log(`======= ENV: ${this.env} =======`);
			console.log(`🚀 App listening on the port ${this.port}`);
			console.log(`=================================`);
		});
	}

	public getServer() {
		return this.app;
	}

	private initializeMiddlewares() {
		this.app.use(morgan(LOG_FORMAT));

		this.app.use(cors());
		this.app.use(hpp());
		this.app.use(helmet({ crossOriginEmbedderPolicy: false }));
		this.app.use(compression());
		this.app.use(express.json({ limit: "1mb" }));
		this.app.use(express.urlencoded({ limit: "1mb", extended: true }));
		this.app.use(authenticate);
	}

	private initializeRoutes(routes: Routes[]) {
		routes.forEach((route) => {
			this.app.use("/", route.router);
		});
	}

	private initializeErrorHandling() {
		this.app.use(errorMiddleware);
	}
}

export default App;
