import 'express';

interface InputUser {
	_id: string;
	role: string;
	assignedSupervisorId: string;
	assignedEmployeeId: string;
}
declare global {
	namespace Express {
		type User = InputUser;
	}
}
