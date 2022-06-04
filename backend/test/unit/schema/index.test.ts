import {
	loginUserSchema,
	signupUserSchema,
	createUserSchema,
	updateUserSchema,
} from '../../..//src/schema/index';
import validateSchema from '../../../src/middleware/validateMiddleware';
import { NextFunction, Request, Response } from 'express';
import { any, AnyZodObject } from 'zod';
import mocks from 'node-mocks-http';
describe('schema validation', () => {
	const loginGoodPayload = { email: 'test1@test.com', password: '123321' };
	const loginBadPayload = { email: 'test1test.com' };
	const mockNext = () => {
		const next = jest.fn();
		return next;
	};
	let req: Request;
	let res: Response;
	let next;
	beforeEach(async () => {
		req = mocks.createRequest();
		res = mocks.createResponse();
		next = mockNext();
	});

	it('should pass the login if payload is valid', () => {
		const validateSchemaTester = validateSchema(loginUserSchema);
		req.body = loginGoodPayload;
		validateSchemaTester(req, res, next);

		expect(next).toHaveBeenCalled;
	});

	it('should fail the login if payload is inValid', () => {
		const validateSchemaTester = validateSchema(loginUserSchema);
		req.body = loginBadPayload;
		validateSchemaTester(req, res, next);
		expect(res.statusCode).toEqual(400);
	});
});
