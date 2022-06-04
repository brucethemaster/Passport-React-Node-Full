import mongoose from 'mongoose';
import UserModel from '../models/user.model';
import logger from '../utils/logger';
import { CollectionInfo, AnyError } from 'mongodb';
import fs from 'fs';

export default async function (mongoose: mongoose.Mongoose) {
	mongoose.connection.db
		.listCollections({ name: UserModel.collection.collectionName })
		.next(
			async (
				err: AnyError | undefined,
				collinfo: CollectionInfo | Pick<CollectionInfo, 'type' | 'name'> | null | undefined,
			) => {
				if (!collinfo) {
					logger.info(
						`Collection ${UserModel.collection.collectionName} not exist. Starting seed data`,
					);
					//const userData = await seedUserData(seedUser);
					const userData = JSON.parse(
						fs.readFileSync(__dirname + '/../../../_seedData//users.json', 'utf-8'),
					);
					await UserModel.insertMany(userData)
						.then(() => {
							logger.info('Data Seeded successfully');
						})
						.catch((err) => {
							logger.error('Data Seeding failed');
							throw err;
						});
				}
			},
		);
}
