import { Request } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.model';

const generateJWT = async (req: Request) => {
	const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
	if (req.headers) {
		const token = req.headers.authorization;

		if (token) {
			return { error: 'A token already exists' };
		}

		const { email } = req.body;

		const user = await UserModel.findOne({ email });
		if (!user) {
			return { error: 'UnAuthorized' };
		}

		const verifiedUser = await UserModel.findOne({ _id: user._id, verified: true });

		console.log(verifiedUser);
		if (!verifiedUser) {
			return { error: 'User is not verified, please contact the administrator' };
		}

		const passwordIsValid = await bcrypt.compare(req.body.password, user.password || '');
		if (!passwordIsValid) {
			return { error: 'Failed to login, please check your credentials' };
		}

		const _id = user._id;
		const role = user.role;

		const expiresIn = '1d';

		const payload = {
			id: _id,
			iat: Date.now(),
			role: role,
			assignedSupervisorId: user.assignedSupervisorId,
		};

		const signedToken = jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn });

		return {
			token: 'Bearer ' + signedToken,
			expires: expiresIn,
		};
	}
};
export { generateJWT };
