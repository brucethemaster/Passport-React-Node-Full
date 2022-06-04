import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URL || 'mongodb://localhost:27017/api-backend-db';

beforeAll(async () => {
	const client = new MongoClient(uri, { keepAlive: true });
	await client.connect();
	const db = client.db('pi-backend-db');
	const users = db.collection('users');
	await users.deleteMany({ email: 'test21@test.com' });
	await client.close();
});
