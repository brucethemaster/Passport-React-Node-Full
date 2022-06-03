import { Request, Response } from 'express';

import logger from '../utils/logger';
import { generateJWT } from '../middleware/authMiddleware';

export async function loginUserHandler(req: Request, res: Response) {
	try {
		const user = await generateJWT(req);

		return res.status(200).json(user);
	} catch (e: any) {
		logger.error(e);
		return res.status(409).send(e);
	}
}
