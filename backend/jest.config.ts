module.exports = {
	roots: ['<rootDir>/test/unit'],
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: true,
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
	testPathIgnorePatterns: ['build/'],
	globals: {
		'ts-jest': {
			diagnostics: false,
		},
	},
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.ts'],
	coverageReporters: ['json', 'text', 'clover'],
	reporters: [
		'default',
		[
			'jest-junit',
			{
				suitName: 'Unit Tests',
				outputDirectory: 'test_reports',
				outputName: 'jest-junit.xml',
			},
		],
	],

	setupFilesAfterEnv: ['<rootDir>/test/setupFile.ts'],
};
