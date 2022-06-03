import { Request, Response, NextFunction } from 'express';

function removeAttribute(object: any, attributes: Array<string>) {
	attributes.forEach((item) => {
		if (Object.prototype.hasOwnProperty.call(attributes, item)) {
			delete object[item];
		}
	});
	return object;
}

export const roleAuth =
	(roles: Array<string>, action: string) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			return res.status(403).json({ error: 'not Authorized' });
		}
		// eslint-disable-next-line
		/* @ts-ignore:*/

		if (roles.includes(req?.user?.role)) {
			// @ts-ignore:
			switch (req?.user?.role) {
				case 'Admin':
					return next();
				case 'Employee':
					// @ts-ignore
					if (req.user._id.toString() === req.params.userId.toString()) {
						if (req.body) {
							req.body = removeAttribute(req.body, [
								'role',
								'assignedSupervisorId',
								'assignedEmployeeId'
							]);
						}
						return next();
					}
				/* falls through */
				case 'Supervisor':
					if (req.params.userId) {
						if (
							// @ts-ignore
							req?.user?.assignedEmployeeId?.includes(req.params.userId.toString()) ||
							// @ts-ignore
							req.user._id.toString() === req.params.userId.toString()
						) {
							if (req.body) {
								req.body = removeAttribute(req.body, [
									'role',
									'assignedEmployeeId',
									'assignedSupervisorId'
								]);
							}
							return next();
						}
					} else {
						return next();
					}
				/* falls through */
				default:
					return res.status(403).json({ error: `Not  authorized to ${action}` });
			}
		} else {
			return res.status(403).json({ error: `Not authorized to ${action}` });
		}
	};
