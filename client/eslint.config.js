import { defineConfig } from "eslint-define-config"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import react from "eslint-plugin-react"
import babelParser from "@babel/eslint-parser"

export default defineConfig([
	{
		ignores: ["dist"],
		files: ["**/*.{js,jsx}"],
		languageOptions: {
			parser: babelParser,
			parserOptions: {
				requireConfigFile: false,
				babelOptions: {
					presets: ["@babel/preset-react"],
				},
			},
			globals: globals.browser,
		},
		plugins: {
			react,
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
		},
		rules: {
			semi: ["error", "never"],
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"react/jsx-uses-react": "warn",
			"react/jsx-uses-vars": "warn",
		},
	},
])
