import _ from 'lodash';
import {
	IUserSignupDocument,
	IUserSignupInput,
	IUserUpdateInput,
	IUserCreateInput,
	IUserCreateDocument,
} from '../interfaces/user.interface';
import UserModel from '../models/user.model';

export async function signupUser(input: IUserSignupInput) {
	try {
		const userIsExists = await UserModel.findOne({ email: input.email });
		if (userIsExists) {
			throw 'User already exists';
		}

		const user = await UserModel.create(input);

		return _.omit(user.toJSON(), ['password', 'version']);
	} catch (e: any) {
		throw new Error(e);
	}
}
export async function createUser(input: IUserCreateInput) {
	try {
		const userIsExists = await UserModel.findOne({ email: input.email });

		if (userIsExists) {
			throw 'User already exists';
		}

		const user = await UserModel.create(input);

		return _.omit(user.toJSON(), ['password', 'version']);
	} catch (e: any) {
		throw new Error(e);
	}
}
export async function updateUserById(input: IUserUpdateInput, id: IUserSignupDocument['id']) {
	try {
		const userIsExists = await UserModel.findOne({ email: input.email, _id: { $ne: id } });

		if (userIsExists) {
			throw 'Email is already exists';
		}

		const user = await UserModel.findOneAndUpdate({ _id: id }, input, { new: true });
		if (user) {
			return _.omit(user.toJSON(), ['password', 'version']);
		}
	} catch (e: any) {
		throw new Error(e);
	}
}
export async function getAllUsers() {
	try {
		const user = await UserModel.find({});
		if (user.length === 0) {
			throw 'No users found';
		}
		return user;
	} catch (e: any) {
		throw new Error(e);
	}
}
export async function getAllUsersBySupervisorId(id: IUserCreateDocument['id']) {
	try {
		const user = await UserModel.find({ assignedSupervisorId: id });

		if (user.length === 0) {
			throw 'No users found';
		}
		return user;
	} catch (e: any) {
		throw new Error(e);
	}
}

export async function getUserById(id: IUserSignupDocument['id']) {
	try {
		const user = await UserModel.findById(id);

		if (user === null) {
			throw 'No users found';
		}
		return user;
	} catch (e: any) {
		throw new Error(e);
	}
}

export async function verifyUserById(id: IUserCreateDocument['id']) {
	try {
		const user = await UserModel.findOneAndUpdate({ _id: id }, { verified: true }, { new: true });
		if (user === null) {
			throw 'No users found';
		}
		return user;
	} catch (e: any) {
		throw new Error(e);
	}
}
export async function deleteUserById(id: IUserSignupDocument['id']) {
	try {
		const user = await UserModel.deleteOne({ _id: id });

		if (user.deletedCount !== 1) {
			throw 'Error deleting user';
		}
		return user;
	} catch (e: any) {
		throw new Error(e);
	}
}
