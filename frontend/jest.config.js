module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['**/?(*.)+(spec).ts'],
  transform: { '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular' }
};
