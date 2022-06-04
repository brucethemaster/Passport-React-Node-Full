import { Request, Response } from 'express';

import { signupUserInput, updateUserInput, createUserInput } from '../schema/user.schema';
import {
	signupUser,
	getUserById,
	updateUserById,
	deleteUserById,
	getAllUsers,
	createUser,
	verifyUserById,
	getAllUsersBySupervisorId,
} from '../service/user.service';
import logger from '../utils/logger';
import _ from 'lodash';
import { IUserSignupDocument } from 'src/interfaces/user.interface';

export async function signupUserHandler(
	req: Request<Record<string, unknown>, signupUserInput['body']>,
	res: Response,
) {
	try {
		const user = await signupUser(req.body);
		return res.send(user);
	} catch (e: any) {
		logger.error(e);
		return res.status(409).send(e.message);
	}
}
export async function createUserHandler(
	req: Request<Record<string, unknown>, Record<string, unknown>, createUserInput['body']>,
	res: Response,
) {
	try {
		const user = await createUser(req.body);
		return res.send(user);
	} catch (e: any) {
		logger.error(e);
		return res.status(409).send(e.message);
	}
}
export async function verifyUserHandler(
	id: IUserSignupDocument['id'],
	req: Request,
	res: Response,
) {
	try {
		const user = await verifyUserById(id);

		if (user) return res.send(_.omit(user.toJSON(), ['password', 'version']));
		else {
			return res.status(404).json({ error: 'User Profile Not Found!' });
		}
	} catch (e: any) {
		logger.error(e);
		return res.status(409).send(e.message);
	}
}
export async function getUserProfileByIdHandler(
	id: IUserSignupDocument['id'],
	req: Request,
	res: Response,
) {
	try {
		const user = await getUserById(id);

		if (user) return res.send(_.omit(user.toJSON(), ['password', 'version']));
		else {
			return res.status(404).json({ error: 'User Profile Not Found!' });
		}
	} catch (e: any) {
		logger.error(e);
		return res.status(409).send(e.message);
	}
}
export async function getAllUserProfilesHandler(req: Request, res: Response) {
	try {
		// @ts-ignore
		let users;
		// @ts-ignore
		const _id = req?.user?._id;
		// @ts-ignore
		if (req?.user?.role === 'Supervisor') {
			users = await getAllUsersBySupervisorId(_id);
		} else {
			users = await getAllUsers();
		}

		if (users) {
			const mappedUsers = users.map((user) => {
				return _.omit(user.toJSON(), ['password', 'version']);
			});
			return res.status(200).json(mappedUsers);
		} else {
			return res.status(404).json({ error: 'Users Profile Not Found!' });
		}
	} catch (e: any) {
		logger.error(e);
		return res.status(409).send(e.message);
	}
}

export async function updateUserHandler(
	id: IUserSignupDocument['id'],
	req: Request<Record<string, unknown>, updateUserInput['body']>,
	res: Response,
) {
	try {
		const user = await updateUserById(req.body, id);
		return res.send(user);
	} catch (e: any) {
		logger.error(e);
		return res.status(409).send(e.message);
	}
}

export async function deleteUserHandler(
	id: IUserSignupDocument['id'],
	req: Request,
	res: Response,
) {
	try {
		const data = await deleteUserById(id);

		const { deletedCount } = data;

		switch (deletedCount) {
			case 1:
				return res.status(200).send('User deleted');

			case 0:
				return res.status(403).send({ error: 'Unable to delete ,User not found' });

			default:
				throw 'Multiple User Profile deleted';
		}
	} catch (e: any) {
		logger.error(e);
		return res.status(409).send(e.message);
	}
}
