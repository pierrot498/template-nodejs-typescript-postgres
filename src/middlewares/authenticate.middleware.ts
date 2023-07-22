import { HttpException } from "@/exceptions/HttpException";
import { logger } from "@/utils/logger";
import { SECRET, db } from "@config";
import { RequestWithToken } from "@interfaces/auth.interface";
import { NextFunction, Request, Response } from "express";
import jwt, { GetPublicKeyOrSecret } from "jsonwebtoken";
import { promisify } from "util";

const verify = promisify(jwt.verify.bind(jwt));

const authenticate = async (
	req: RequestWithToken,
	res: Response,
	next: NextFunction,
) => {
	try {
		//user routes
		if (req.path.includes("/user")) {
			const accessToken = getAccessToken(req);
			//Checks if token is verified and get parsed token
			const parsedToken: any = await verifyToken(accessToken);
			//Best practice to send data through res.locals
			res.locals.client_id = parsedToken.id;
		} else if (
			req.path.startsWith("/login") ||
			req.path.startsWith("/signup")
		) {
			//Do something
		} else if (req.path.startsWith("/logout")) {
			const accessToken = getAccessToken(req);
			//Checks if token is verified

			await verifyToken(accessToken);
			res.locals.token = accessToken;
		} else {
			logger.error(`The provided URI is invalid - ${req.path}`);
			throw new HttpException(404, "Invalid URI");
		}

		next();
	} catch (error) {
		return next(error);
	}
};

const verifyToken = async (token: string) => {
	try {
		//Check if revoked
		return await jwt.verify(token, SECRET);
	} catch (error) {
		logger.error("Invalid access token provided");
		throw new HttpException(401, "Invalid access token");
	}
};

const getAccessToken = (req: Request) => {
	const authorizationHeaderValue = req.headers.authorization ?? "";
	const [, token] = authorizationHeaderValue.split("Bearer ");

	return token;
};

export default authenticate;
