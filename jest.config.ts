import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  preset: "ts-jest",
  setupFiles: ["jest-canvas-mock"],
};

export default config;
