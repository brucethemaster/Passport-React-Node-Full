import mongoose from 'mongoose';
import logger from '../utils/logger';
import seedData from './seedData';

const connect = async (dbUrl: string) => {
	try {
		await mongoose.connect(dbUrl);
		logger.info('Connected to database successfully');

		await seedData(mongoose);
	} catch (err) {
		logger.error('Could not connect to DB');
		process.exit(1);
	}
};

export default connect;
