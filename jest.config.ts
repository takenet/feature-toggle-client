export default {
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/*.spec.ts"],
};
