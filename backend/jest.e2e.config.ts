module.exports = {
	roots: ['<rootDir>/test/e2e'],
	testMatch: ['<rootDir>/test/e2e/**/*.test.ts?(x)'],
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverage: true,
	reporters: [
		'default',
		[
			'jest-junit',
			{
				suiteName: 'E2E test',
				outputDirectory: 'test_reports',
				outputName: 'e2e-test-report.xml',
			},
		],
	],
	setupFilesAfterEnv: ['<rootDir>/test/setupFile.e2e.ts'],
};
