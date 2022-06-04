import app from './app';
import connect from './utils/connect';
import logger from './utils/logger';
const port = (process.env.PORT || 3000) as number;
const dbUrl = (process.env.MONGODB_URL || '') as string;

app().then((app) => {
	app.listen(port, async () => {
		logger.info(`Express server is running on port:${port}`);
		await connect(dbUrl);
	});
});
