import { object, string, TypeOf, array, boolean } from 'zod';

export const signupUserSchema = object({
	body: object({
		first_name: string({
			required_error: 'Name is required'
		}),
		last_name: string({
			required_error: 'Name is required'
		}),
		role: string({
			required_error: 'Name is required'
		}),
		password: string()
			.regex(new RegExp('.*[A-Z].*'), 'Must have one uppercase character')
			.regex(new RegExp('.*[a-z].*'), 'Must have one lowercase character')
			.regex(new RegExp('.*\\d.*'), 'Must have one number')
			.regex(
				new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
				'Must have one special character'
			)
			.min(8, 'Must be at least 8 characters in length'),
		passwordConfirmation: string({
			required_error: 'passwordConfirmation is required'
		}),
		email: string({
			required_error: 'Email is required'
		}).email('Not a valid email')
	}).refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation']
	})
});

export const createUserSchema = object({
	body: object({
		first_name: string({
			required_error: 'Name is required'
		}),
		last_name: string({
			required_error: 'Name is required'
		}),
		role: string({
			required_error: 'Name is required'
		}),
		password: string()
			.regex(new RegExp('.*[A-Z].*'), 'Must have one uppercase character')
			.regex(new RegExp('.*[a-z].*'), 'Must have one lowercase character')
			.regex(new RegExp('.*\\d.*'), 'Must have one number')
			.regex(
				new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
				'Must have one special character'
			)
			.min(8, 'Must be at least 8 characters in length'),
		passwordConfirmation: string({
			required_error: 'passwordConfirmation is required'
		}),
		email: string({
			required_error: 'Email is required'
		}).email('Not a valid email'),
		assignedEmployeeId: array(
			string({ required_error: 'Assigned employee id is required' })
		).optional(),
		assignedSupervisorId: string({
			required_error: 'Assigned supervisor id is required'
		}).optional(),
		verified: boolean({ required_error: 'verify user  is required' })
	}).refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation']
	})
});

export const updateUserSchema = object({
	body: object({
		first_name: string({
			required_error: 'Name is required'
		}).optional(),
		last_name: string({
			required_error: 'Name is required'
		}).optional(),
		role: string({
			required_error: 'Name is required'
		}).optional(),
		password: string()
			.regex(new RegExp('.*[A-Z].*'), 'Must have one uppercase character')
			.regex(new RegExp('.*[a-z].*'), 'Must have one lowercase character')
			.regex(new RegExp('.*\\d.*'), 'Must have one number')
			.regex(
				new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
				'Must have one special character'
			)
			.min(8, 'Must be at least 8 characters in length')
			.optional(),
		passwordConfirmation: string({
			required_error: 'passwordConfirmation is required'
		}).optional(),
		email: string({
			required_error: 'Email is required'
		})
			.email('Not a valid email')
			.optional(),
		assignedEmployeeId: array(
			string({ required_error: 'Assigned employee id is required' })
		).optional(),
		assignedSupervisorId: string({
			required_error: 'Assigned supervisor id is required'
		}).optional()
	})
		.strict()

		.refine((data) => !!data.password !== !data.passwordConfirmation, {
			message: 'Passwords do not match',
			path: ['passwordConfirmation']
		})
		.refine((data) => data.password === data.passwordConfirmation, {
			message: 'Passwords do not match',
			path: ['passwordConfirmation']
		})
});
export type updateUserInput = Omit<
	TypeOf<typeof updateUserSchema>,
	'body.passwordConfirmation' | 'body.password'
>;

export type signupUserInput = Omit<TypeOf<typeof signupUserSchema>, 'body.passwordConfirmation'>;
export type createUserInput = Omit<TypeOf<typeof createUserSchema>, 'body.passwordConfirmation'>;
