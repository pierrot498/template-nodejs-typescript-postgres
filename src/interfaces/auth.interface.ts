import { Request } from "express";

// custom data type for user authentication token
export interface Token {
	idToken: string;
	accessToken: string;
	refreshToken: string;
}

// custom data type for decoded authentication token
export interface TokenDecoded {
	email: String;
	exp: String;
	auth_time: String;
	token_use: String;
	sub: String;
}

// custom data type for api request with jwt token
export interface RequestWithToken extends Request {
	token: string;
}
