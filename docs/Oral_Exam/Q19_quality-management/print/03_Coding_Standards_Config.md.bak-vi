# CẤU HÌNH ĐẢM BẢO CODING STANDARDS
**Dự án:** Hệ thống Luyện thi Phỏng vấn



## 1. Cấu hình Prettier (`.prettierrc`)

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

## 2. Cấu hình ESLint (`.eslintrc.json`)
*Mục đích: Bắt các lỗi khai báo biến không dùng, lỗi cú pháp hoặc thói quen code xấu ngay trong lúc gõ code.*

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
