# Coding Standards Configuration

**Project:** Interview Practice Platform

## 1. Prettier configuration (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

## 2. ESLint configuration (`.eslintrc.json`)
*Purpose: catch unused variable declarations, syntax errors, and bad coding habits while typing.*

```json
{
  "env": {
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "eqeqeq": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```
