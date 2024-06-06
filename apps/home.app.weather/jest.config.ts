import { compilerOptions } from './tsconfig.json';
import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';

const config: Config.InitialOptions = {
  // setupFiles: ['<rootDir>/src/.jest/setEnvVars.js'],
  // setupFilesAfterEnv: ['<rootDir>/src/.jest/test-setup.js'],
  preset: 'ts-jest',
  //testEnvironment: 'jest-environment-jsdom',
  transform: {
    // process `*.tsx` files with `ts-jest`
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|scss|png)$': 'identity-obj-proxy',
  },
  // collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  detectOpenHandles: true,
  verbose: true,
  passWithNoTests: true,
  roots: ['src/'],
  //setupFiles: ['<rootDir>/src/.jest/globalSetup.ts'],
  testEnvironment: './src/test-utils/undici-mockagent-fetch-jest.ts',

  // runner: 'groups',
};

export default config;
