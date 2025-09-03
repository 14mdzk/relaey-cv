import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.tsx",
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    server: {
        watch: {
            usePolling: true,
        },
    },
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "./resources"),
        },
    },
});
