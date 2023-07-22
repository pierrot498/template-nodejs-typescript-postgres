import { object, string } from "yup";

/**
 * @description Client signup schema
 * used to validate the api body for insert
 */

export const clientSignup = object({
	name: string().required(),
	email: string().email().required(),
	password: string()
		.required("No password provided.")
		.min(8, "Password is too short - should be 8 chars minimum.")
		.matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
});

/**
 * @description Client login schema
 * used to validate the api body for insert
 */
export const clientLogin = object({
	email: string().email().required(),
	password: string()
		.required("No password provided.")
		.min(8, "Wrong password")
		.matches(/[a-zA-Z]/, "Wrong password"),
});
