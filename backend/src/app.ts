import express from 'express';

import routes from './routes';
import cors from 'cors';

import passport from 'passport';
import passportStrategy from './config/passport';

const app = async () => {
	const app = express();
	app.use(cors());
	passportStrategy(passport);
	app.use(passport.initialize());
	app.use(express.json());
	routes(app);
	return app;
};
export default app;
