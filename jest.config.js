import { createDefaultPreset } from "ts-jest";

/** @type {import("jest").Config} **/
const tsJestTransformCfg = createDefaultPreset().transform;

export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  testEnvironmentOptions: {
    globalsCleanup: 'on',
  },
  collectCoverageFrom: [
    "src/**/*.ts"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};