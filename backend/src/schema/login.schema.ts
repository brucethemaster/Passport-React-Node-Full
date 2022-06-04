import { object, string } from 'zod';

export const loginUserSchema = object({
	body: object({
		email: string({
			required_error: 'Email is required',
		}).email('Not a valid email'),
		password: string({
			required_error: 'Password is required',
		}),
	}).strict(),
});
