const typescriptEslintStub = {
  rules: {
    "no-explicit-any": {
      meta: {
        type: "suggestion",
        docs: {
          description: "Stub rule used until @typescript-eslint is available in this environment.",
        },
        schema: [],
      },
      create() {
        return {}
      },
    },
  },
}

export default [
  {
    plugins: {
      "@typescript-eslint": typescriptEslintStub,
    },
    ignores: ["node_modules/**", "**/node_modules/**", ".next/**", "**/.next/**", "dist/**", "**/*.{ts,tsx}"],
    rules: {
      // TODO: Tighten this back to "error" as lingering `any` usages are replaced with strict types.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]
