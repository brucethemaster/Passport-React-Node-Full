import logger from 'pino';
import dayjs from 'dayjs';
//import { timeStamp } from 'console'

const log = logger({
	transport: {
		target: 'pino-pretty',
	},

	base: {
		pid: false,
	},
	timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;
