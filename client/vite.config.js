import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
	plugins: [react()],
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
	server: {
		port: 4173,
		host: "0.0.0.0",
	}
})
