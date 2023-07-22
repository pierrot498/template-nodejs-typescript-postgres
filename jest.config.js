/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

	reporters: ["default"],
	moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
		"@services/(.*)": "<rootDir>/src/services/$1",
		"@exceptions/(.*)": "<rootDir>/src/exceptions/$1",
		"@config": "<rootDir>/src/config",
		"@utils/(.*)": "<rootDir>/src/utils/$1",
		"@middlewares/(.*)": "<rootDir>/src/middlewares/$1",
		"@routes/(.*)": "<rootDir>/src/routes/$1",
		"@controllers/(.*)": "<rootDir>/src/controllers/$1",
		"@routes/(.*)": "<rootDir>/src/routes/$1",
		"@interfaces/(.*)": "<rootDir>/src/interfaces/$1",
		"@schemas/(.*)": "<rootDir>/src/schemas/$1",
		"@/(.*)": "<rootDir>/src/$1",
	},
  testMatch:["<rootDir>/src/tests/endpoints/*.spec.ts"]
};

