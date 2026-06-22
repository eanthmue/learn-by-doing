import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        Blob: "readonly",
        BroadcastChannel: "readonly",
        EventSource: "readonly",
        FormData: "readonly",
        HTMLTextAreaElement: "readonly",
        MessageChannel: "readonly",
        MessageEvent: "readonly",
        MessagePort: "readonly",
        Response: "readonly",
        ScrollBehavior: "readonly",
        SharedWorker: "readonly",
        URL: "readonly",
        WebSocket: "readonly",
        Worker: "readonly",
        XMLHttpRequest: "readonly",
        caches: "readonly",
        close: "readonly",
        console: "readonly",
        crypto: "readonly",
        document: "readonly",
        fetch: "readonly",
        globalThis: "readonly",
        indexedDB: "readonly",
        importScripts: "readonly",
        localStorage: "readonly",
        location: "readonly",
        navigator: "readonly",
        postMessage: "readonly",
        process: "readonly",
        self: "readonly",
        sessionStorage: "readonly",
        window: "readonly",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
);
