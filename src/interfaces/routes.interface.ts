import { Router } from "express";

// custom data type for routes
export interface Routes {
	path?: string;
	router: Router;
}
