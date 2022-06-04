import { MongooseError } from 'mongoose';
import { PassportStatic } from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { IUserSignupInput } from '../interfaces/user.interface';
import UserModel from '../models/user.model';
const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET || 'supersecret',
};
export default (passport: PassportStatic) => {
	passport.use(
		new JwtStrategy(options, (payload: any, done: any) => {
			UserModel.findOne(
				{ _id: payload.id, verified: true },
				function (err: MongooseError, user: IUserSignupInput) {
					if (err) {
						return done(err, false);
					}
					if (user) {
						return done(null, user);
					} else {
						return done(null, false);
					}
				},
			);
		}),
	);
};
