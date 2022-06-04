import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import {
	IUserSignupDocument,
	IUserSignupInput,
	IUserUpdateDocument,
	IUserUpdateInput,
	IUserCreateInput,
	IUserCreateDocument,
} from '../interfaces/user.interface';
import { updateUserInput } from 'src/schema/user.schema';

const Schema = mongoose.Schema;
const saltFactor = Number(process.env.SALT_FACTOR || 10);

const userSchema = new Schema(
	{
		first_name: {
			type: String,
			required: true,
		},
		last_name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true, maxLength: 60 },
		role: { type: String, required: true, enum: ['Employee', 'Supervisor', 'Admin'] },
		assignedSupervisorId: {
			type: Schema.Types.ObjectId,
			ref: 'userSchema',
		},

		assignedEmployeeId: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'userSchema',
				},
			],
			default: undefined,
		},
		verified: { type: Boolean, default: false },
	},
	{ timestamps: true, versionKey: 'version' },
);

userSchema.pre<IUserCreateInput | IUserSignupInput | updateUserInput>(
	'save',
	async function (next) {
		const user = this as IUserCreateDocument;

		if (!user.isModified('password')) {
			return next();
		}

		const salt = await bcrypt.genSalt(saltFactor);
		const hash = await bcrypt.hash(user.password, salt);

		user.password = hash;

		return next();
	},
);

userSchema.pre<IUserUpdateInput | any>('findOneAndUpdate', async function (next) {
	if (!this._update.password) {
		return next();
	}

	if (this._update.password) {
		const salt = await bcrypt.genSalt(saltFactor);
		const hash = await bcrypt.hash(this._update.password, salt);

		this._update.password = hash;
	}
	return next();
});

const UserModel = mongoose.model<IUserSignupDocument | IUserUpdateDocument | IUserCreateDocument>(
	'users',
	userSchema,
);

export default UserModel;
