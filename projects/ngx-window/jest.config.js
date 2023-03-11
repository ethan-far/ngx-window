// jest.config.js
require('jest-preset-angular/ngcc-jest-processor');

// jest.config.js
module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: [
        '<rootDir>/setup-jest.ts'
    ],
    testPathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/dist/",
    ],
    testRunner: 'jest-jasmine2',
    globals: {
        'ts-jest': {
            esModuleInterop: true
        }
    },
    coverageThreshold: {
        global: {
            branches: 95,
            functions: 95,
            lines: 95,
            statements: 95
        }
    }
};
