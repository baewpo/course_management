import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import eslint from "vite-plugin-eslint"
import path from "path"

export default defineConfig({
	plugins: [react(), eslint({ fix: false })],
	resolve: {
		alias: {
			config: path.resolve(__dirname, "src/config"),
			components: path.resolve(__dirname, "src/components"),
			src: path.resolve(__dirname, "src"),
			models: path.resolve(__dirname, "src/models"),
			contexts: path.resolve(__dirname, "src/contexts"),
			pages: path.resolve(__dirname, "src/pages"),
			routes: path.resolve(__dirname, "src/routes"),
		},
	},
})
