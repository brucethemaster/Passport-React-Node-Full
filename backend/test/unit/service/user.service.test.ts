import {
	signupUser,
	createUser,
	updateUserById,
	getUserById,
	deleteUserById,
	getAllUsers,
	verifyUserById,
	getAllUsersBySupervisorId,
	userInputPreHook,
} from '../../../src/service/user.service';

const userPayload = {
	first_name: 'Bruce',
	last_name: 'Jack',
	password: 'Hello1123+_',
	passwordConfirmation: 'Hello123+_',
	email: 'test221@test.com',
	role: 'Employee',
};

const userCreatePayload = {
	first_name: 'Bruce',
	last_name: 'Jack',
	password: 'Hello1123+_',
	passwordConfirmation: 'Hello123+_',
	email: 'test221@test.com',
	role: 'Employee',
	verified: true,
};
const userCreatePayload2 = {
	first_name: 'Andy',
	last_name: 'Jack',
	password: 'Hello1123+_',
	passwordConfirmation: 'Hello123+_+',
	email: 'test222@test.com',
	role: 'Employee',
	verified: false,
};
const userCreatePayload3 = {
	first_name: 'Andy',
	last_name: 'Jack',
	password: 'Hello1123+_',
	passwordConfirmation: 'Hello123+_',
	email: 'test222@test.com',
	role: 'Employee',
	assignedSupervisorId: '629642c7eba5741e095f1972',
	verified: false,
};
const userBadPayload = {
	first_name: 123,
	last_name: 'Jack',
	email: 'test221test',
	role: 'Employee',
};
const userUpdatePayload = {
	first_name: 'Tom',
	last_name: 'Jack',
	password: 'Hello1123+_+',
	passwordConfirmation: 'Hello123+_+',
	email: 'test221@test.com',
	role: 'Employee',
};

const userUpdatePayload2 = {
	first_name: 'Tom',
	last_name: 'Jack',

	email: 'test221@test.com',
	role: 'Employee',
};
describe('user service', () => {
	it('should able signup a new user with valid input', async () => {
		const user = await signupUser(userPayload);
		expect(user.first_name).toEqual('Bruce');
	});

	it('should failed signup user if input invalid ', async () => {
		//@ts-ignore testing bad payload
		expect(signupUser(userBadPayload)).rejects.toThrow();
	});
	it('should able create a new user with valid input', async () => {
		const user = await createUser(userCreatePayload);
		expect(user.first_name).toEqual('Bruce');
	});

	it('should failed signup user if same email exist ', async () => {
		//@ts-ignore testing bad payload
		await createUser(userCreatePayload);
		await expect(signupUser(userCreatePayload)).rejects.toThrow('User already exists');

		//	expect(signupUser(userBadPayload)).rejects.toThrow();
	});

	it('should failed create user if same email exist ', async () => {
		//@ts-ignore testing bad payload
		await createUser(userCreatePayload);
		await expect(createUser(userCreatePayload)).rejects.toThrow('User already exists');

		//	expect(signupUser(userBadPayload)).rejects.toThrow();
	});

	it('should able update a user by id ', async () => {
		const user = await createUser(userCreatePayload);
		const id = user._id;
		const result = await updateUserById(userUpdatePayload, id);
		expect(result?.first_name).toEqual('Tom');
	});

	it('should able update a user by id wihtout changing password', async () => {
		const user = await createUser(userCreatePayload);
		const id = user._id;
		const result = await updateUserById(userUpdatePayload2, id);
		expect(result?.first_name).toEqual('Tom');
	});

	it('should failed update a user by id, if intend  to update email exists ', async () => {
		const user = await createUser(userCreatePayload);
		const id = user._id;
		await createUser(userCreatePayload2);

		await expect(updateUserById(userCreatePayload2, id)).rejects.toThrow();
	});

	it('should able get a user by id ', async () => {
		const user = await createUser(userCreatePayload);
		const id = user._id;
		const result = await getUserById(id);
		expect(result?.first_name).toEqual('Bruce');
	});

	it('should failed get a user by id, if user not exist', async () => {
		await expect(getUserById(userCreatePayload3.assignedSupervisorId)).rejects.toThrow();
	});

	it('should able delete a user by id ', async () => {
		const user = await createUser(userCreatePayload);
		const id = user._id;
		const result = await deleteUserById(id);
		expect(result.deletedCount).toEqual(1);
	});

	it('should failed delete a user by id,if not exists', async () => {
		await expect(deleteUserById(userCreatePayload3.assignedSupervisorId)).rejects.toThrow();
	});
	it('should able get all user  ', async () => {
		await createUser(userCreatePayload);
		await createUser(userCreatePayload2);

		const result = await getAllUsers();
		expect(result.length).toEqual(2);
	});

	it('should failed get all user if no user exists ', async () => {
		await expect(getAllUsers()).rejects.toThrow();
	});

	it('should able verify user by Id  ', async () => {
		const user = await createUser(userCreatePayload2);
		expect(user.verified).toEqual(false);
		const id = user._id;
		const result = await verifyUserById(id);
		expect(result?.first_name).toEqual('Andy');
	});
	it('should failed verify user by Id ,if user not exist ', async () => {
		await expect(verifyUserById(userCreatePayload3.assignedSupervisorId)).rejects.toThrow();
	});
	it('should able get user by supervisor Id  ', async () => {
		const user = await createUser(userCreatePayload3);
		expect(user.verified).toEqual(false);
		const result = await getAllUsersBySupervisorId('629642c7eba5741e095f1972');
		expect(result[0].first_name).toEqual('Andy');
	});

	it('should failed get user by supervisor Id if not found ', async () => {
		const user = await createUser(userCreatePayload3);
		expect(user.verified).toEqual(false);
		await expect(getAllUsersBySupervisorId('629642c7eba5741e095f1971')).rejects.toThrow();
	});

	it('should execute next middleware when password is modified', async () => {
		const mockNext = jest.fn();
		const mockContext = {
			isModified: jest.fn(),
		};
		mockContext.isModified.mockReturnValueOnce(false);
		await userInputPreHook.call(mockContext, mockNext);
		expect(mockContext.isModified).toBeCalledWith('password');
		expect(mockNext).toBeCalledTimes(1);
	});
});
