import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/**/*.ts", "tests/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports", fixStyle: "separate-type-imports" }]
    },
    rules: {
      // --- TypeScript Rules ---
      "@typescript-eslint/no-unused-vars": [
        "error",
        { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/typedef": [
        "error",
        {
          variableDeclaration: false,
          variableDeclarationIgnoreFunction: true,
          parameter: true,
          propertyDeclaration: true,
          memberVariableDeclaration: true,
        }
      ],
      "@typescript-eslint/no-inferrable-types": "error",
      // --- Style & Readability ---
      "@typescript-eslint/member-ordering": "off",
      "@typescript-eslint/naming-convention": [
        "warn",
        { selector: "variableLike", format: ["camelCase", "UPPER_CASE"], "leadingUnderscore": "allow" },
        { selector: "typeLike", format: ["PascalCase"] },
      ],
      // --- General Best Practices ---
      "eqeqeq": ["error", "always"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "curly": ["error", "all"],
      "prefer-const": "error",
      // --- Performance rules ---
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/prefer-readonly": "warn",
    }
  },
];
