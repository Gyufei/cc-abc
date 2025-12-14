import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([{
  extends: compat.extends("next/core-web-vitals", "next/typescript"),
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
    }],
    // 关闭在 effect 中直接调用 setState 的限制，以允许在依赖变更时执行重置逻辑
    "react-hooks/set-state-in-effect": "off",
    // 可选：保留或降低依赖检查的噪声级别
    "react-hooks/exhaustive-deps": "warn",
  },
}]);
