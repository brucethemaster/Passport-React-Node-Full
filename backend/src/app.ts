import express from 'express';
//import {} from 'dotenv/config';
import connect from './utils/connect';
import logger from './utils/logger';
import routes from './routes';
import cors from 'cors';
//import bodyParser from 'body-parser';
import passport from 'passport';
import passportStrategy from './config/passport';
const dbUrl = (process.env.MONGODB_URL || '') as string;
const app = express();
const port = (process.env.PORT || 3000) as number;

app.use(cors());
passportStrategy(passport);
app.use(passport.initialize());
app.use(express.json());

app.listen(port, async () => {
	logger.info(`Express server is running on port:${port}`);
	await connect(dbUrl);
	routes(app);
});
