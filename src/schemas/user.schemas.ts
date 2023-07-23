import { array, number, object, string } from "yup";

/**
 * @description User insert schema
 * used to validate the api body for insert
 */
export const userSchema = object({
	name: string().required(),
	email: string().email("Valid email not provided.").required(),
})
	.noUnknown(true)
	.strict();

/**
 * @description User update schema
 * used to validate the api body for update
 */

export const updateUserSchema = object({
	name: string().nullable(),
	email: string().email("Valid email not provided."),
})
	.noUnknown(true)
	.strict();
