import {
	loginUserSchema,
	signupUserSchema,
	createUserSchema,
	updateUserSchema,
} from '../../..//src/schema/index';
import validateSchema from '../../../src/middleware/validateMiddleware';
import { NextFunction, Request, Response } from 'express';
import mocks from 'node-mocks-http';
import payload from './payloads';
describe('schema validation', () => {
	const mockNext = () => {
		const next = jest.fn();
		return next;
	};
	let req: Request;
	let res: Response;
	let next: NextFunction;
	beforeEach(async () => {
		req = mocks.createRequest();
		res = mocks.createResponse();
		next = mockNext();
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should pass the login if payload is valid', () => {
		const validateSchemaTester = validateSchema(loginUserSchema);

		req.body = payload.loginGoodPayload;
		validateSchemaTester(req, res, next);
		expect(next).toHaveBeenCalled;
	});

	it('should fail the login if payload is invalid', () => {
		const validateSchemaTester = validateSchema(loginUserSchema);

		req.body = payload.loginBadPayload;
		validateSchemaTester(req, res, next);
		expect(res.statusCode).toEqual(400);
	});

	it('should pass the sing up if payload is valid', () => {
		const validateSchemaTester = validateSchema(signupUserSchema);

		req.body = payload.sinupGoodPayload;
		validateSchemaTester(req, res, next);
		expect(next).toHaveBeenCalled;
	});

	it('should fail the sing up if payload is invalid', () => {
		const validateSchemaTester = validateSchema(createUserSchema);

		req.body = payload.sinupBadPayload;
		validateSchemaTester(req, res, next);
		expect(res.statusCode).toEqual(400);
	});
	it('should pass the create user if payload is valid', () => {
		const validateSchemaTester = validateSchema(createUserSchema);

		req.body = payload.createUserGoodPayload;
		validateSchemaTester(req, res, next);
		expect(next).toHaveBeenCalled;
	});

	it('should fail the create user if payload is invalid', () => {
		const validateSchemaTester = validateSchema(updateUserSchema);

		req.body = payload.createUserBadPayload;
		validateSchemaTester(req, res, next);
		expect(res.statusCode).toEqual(400);
	});
	it('should pass the update user if payload is valid', () => {
		const validateSchemaTester = validateSchema(updateUserSchema);

		req.body = payload.updateUserGoodPayload;
		validateSchemaTester(req, res, next);
		expect(next).toHaveBeenCalled;
	});

	it('should fail the update user if payload is invalid', () => {
		const validateSchemaTester = validateSchema(signupUserSchema);

		req.body = payload.updateUserBadPayload;
		validateSchemaTester(req, res, next);
		expect(res.statusCode).toEqual(400);
	});
});
