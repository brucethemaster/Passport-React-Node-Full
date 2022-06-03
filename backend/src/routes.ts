import { Express, Request, Response } from 'express';
import { signupUserSchema, updateUserSchema, createUserSchema } from './schema/user.schema';
import { loginUserSchema } from './schema/login.schema';
import {
	signupUserHandler,
	createUserHandler,
	getUserProfileByIdHandler,
	getAllUserProfilesHandler,
	updateUserHandler,
	deleteUserHandler,
	verifyUserHandler,
} from './controllers/user.controller';
import ValidateResource from './middleware/validateMiddleware';
import { loginUserHandler } from './controllers/login.controller';
import { roleAuth } from './middleware/rabcMiddleware';
import { Role } from './constants/enum';
import passport from 'passport';

const routes = (app: Express) => {
	app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200));

	app.post('/api/signup', ValidateResource(signupUserSchema), signupUserHandler);

	app.post('/api/login', ValidateResource(loginUserSchema), loginUserHandler);

	app.post(
		'/api/create',
		passport.authenticate('jwt', { session: false }),
		roleAuth([Role.Admin], 'create an users profile'),
		ValidateResource(createUserSchema),
		createUserHandler
	);
	app.patch(
		'/api/verify/:userId',
		passport.authenticate('jwt', { session: false }),
		roleAuth([Role.Admin], 'verify a user'),

		async (req, res) => {
			const id = req.params.userId;

			await verifyUserHandler(id, req, res);
		}
	);

	app.get(
		'/api/profiles',
		passport.authenticate('jwt', { session: false }),
		roleAuth([Role.Admin, Role.Supervisor], 'view  all users profile'),

		getAllUserProfilesHandler
	);
	app.get(
		'/api/profile/:userId',
		passport.authenticate('jwt', { session: false }),
		roleAuth([Role.Admin, Role.Employee, Role.Supervisor], 'view user profile'),
		async (req, res) => {
			const id = req.params.userId;

			await getUserProfileByIdHandler(id, req, res);
		}
	);

	app.patch(
		'/api/update/:userId',
		passport.authenticate('jwt', { session: false }),
		roleAuth([Role.Admin, Role.Employee, Role.Supervisor], 'update user profile'),
		ValidateResource(updateUserSchema),
		async (req, res) => {
			const id = req.params.userId;

			await updateUserHandler(id, req, res);
		}
	);

	app.delete(
		'/api/delete/:userId',
		passport.authenticate('jwt', { session: false }),
		roleAuth([Role.Admin], 'delete user profile'),

		async (req, res) => {
			const id = req.params.userId;

			await deleteUserHandler(id, req, res);
		}
	);
};

export default routes;
