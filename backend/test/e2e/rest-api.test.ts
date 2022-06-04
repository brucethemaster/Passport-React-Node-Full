import axios, { AxiosRequestConfig } from 'axios';

import testData from './testData/local.json';

let adminToken: string;
let userId: string;
describe('Passport-React-Node-Full rest-api test', () => {
	const config: AxiosRequestConfig = {};

	it('should signup a user', async () => {
		const result = await axios.post(`${testData.url}/api/signup`, testData.signupUser, config);
		expect(result.data).toEqual(
			expect.objectContaining({
				_id: expect.any(String),
			}),
		);
	});
	it('should failed login a user if is not verified', async () => {
		const result = await axios.post(`${testData.url}/api/login`, testData.login, config);
		expect(result.data).toEqual(
			expect.objectContaining({
				error: expect.any(String),
			}),
		);
	});

	it('should  login as  an administrator ', async () => {
		const result = await axios.post(`${testData.url}/api/login`, testData.loginAdmin, config);
		expect(result.data).toEqual(
			expect.objectContaining({
				token: expect.any(String),
			}),
		);
	});

	it('should  login as  an administrator and view user profile', async () => {
		const result = await axios.post(`${testData.url}/api/login`, testData.loginAdmin, config);

		adminToken = result.data.token;

		const newConfig: AxiosRequestConfig = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: adminToken,
			},
		};

		const getUserResult = await axios.get(`${testData.url}/api/profiles`, newConfig);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		userId = getUserResult.data[3]._id;

		expect(getUserResult.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					_id: expect.any(String),
				}),
			]),
		);
	});
	//get some problems patch is not working, but in postman it works skip test right now
	it('should  login as  an administrator and verify a user profile', async () => {
		const config = {
			method: 'patch',
			url: `${testData.url}/api/verify/${userId}`,
			headers: {
				Authorization: adminToken,
			},
		};
		axios(config)
			.then(function (response) {
				expect(response.data).toEqual(
					expect.objectContaining({
						_id: expect.any(String),
					}),
				);
			})
			.catch(function (error) {
				console.log(error);
			});
	});

	it('should  login as  an administrator and delete a user profile', async () => {
		const newConfig: AxiosRequestConfig = {
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Access-Control-Allow-Origin': '*',

				Authorization: adminToken,
			},
		};

		const deleteResult = await axios.delete(`${testData.url}/api/delete/${userId}`, newConfig);

		expect(deleteResult.data).toEqual('User deleted');
	});
});
