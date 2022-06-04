import express from 'express';
import connect from './utils/connect';
import routes from './routes';
import cors from 'cors';

import passport from 'passport';
import passportStrategy from './config/passport';

const app = async (dbUrl) => {
	const app = express();
	app.use(cors());
	passportStrategy(passport);
	app.use(passport.initialize());
	app.use(express.json());
	routes(app);
	await connect(dbUrl);
	return app;
};
export default app;
