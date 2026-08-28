"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
var vite_tsconfig_paths_1 = require("vite-tsconfig-paths");
exports.default = (0, config_1.defineConfig)({
    // Resolves the path aliases declared in tsconfig.json, including the ones
    // added by `nest g library`.
    plugins: [(0, vite_tsconfig_paths_1.default)()],
    test: {
        globals: true,
        root: './',
        include: ['**/*.spec.ts'],
    },
});
