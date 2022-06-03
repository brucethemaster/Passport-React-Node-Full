import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URL_TEST || 'mongodb://localhost:27017/api-backend-db-test';

//setup a test database
MongoClient.connect(uri, (err, db: any) => {
	if (err) throw err;
	db.close();
});

beforeAll(async () => {
	await mongoose.connect(uri);
});

afterEach(async () => {
	const collections = mongoose.connection.collections;

	for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoose.connection.close();
});
