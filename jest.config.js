module.exports = {
  name: "typescript-starter",
  preset: "ts-jest",
  automock: false,
  collectCoverage: true,
  modulePaths: ["src"],
  reporters: ["default", "jest-junit"],
  testPathIgnorePatterns: ["dist/.*"],
}
