import type { Config } from 'jest';

const config: Config = {
  rootDir: '.',

  moduleFileExtensions: ['js', 'json', 'ts'],

  testRegex: '.*\\.spec\\.ts$',

  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  testEnvironment: 'node',

  moduleNameMapper: {
    '^@app-prisma/(.*)$': '<rootDir>/src/prisma/$1',
    '^@module/(.*)$': '<rootDir>/src/modules/$1',
  },
};

export default config;