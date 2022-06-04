import mongoose, { Types } from 'mongoose';

export interface IUserSignupInput {
	email: string;
	first_name: string;
	last_name: string;
	password: string;
	role: string;
}

export interface IUserCreateInput {
	email: string;
	first_name: string;
	last_name: string;
	password: string;
	role: string;
	assignedSupervisorId?: string;
	assignedEmployeeId?: string[];
	verified: boolean;
}

export interface IUserLoginInput {
	email: string;
	password: string;
}

export interface IUserUpdateInput {
	email?: string;
	first_name?: string;
	last_name?: string;
	password?: string;
	role?: string;
	assignedSupervisorId?: string;
	assignedEmployeeId?: string[];
}

export interface IUserSignupDocument extends IUserSignupInput, mongoose.Document {
	createdAt: Date;
	updatedAt: Date;
	assignedSupervisorId: {
		type: Types.ObjectId;
		ref: 'userSchema';
	};

	assignedEmployeeId: [
		{
			type: Types.ObjectId;
			ref: 'userSchema';
		},
	];
	comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface IUserUpdateDocument extends IUserUpdateInput, mongoose.Document {
	createdAt: Date;
	updatedAt: Date;

	comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface IUserCreateDocument extends IUserCreateInput, mongoose.Document {
	createdAt: Date;
	updatedAt: Date;

	comparePassword(candidatePassword: string): Promise<boolean>;
}
