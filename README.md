# Open Music Admin

此项目是 [Open Music](https://github.com/Spidey120703/open-music) 项目的后台管理端。

## 推荐的 IDE 配置

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (务必禁用 Vetur) + [Github Copilot](https://copilot.github.com/).
- [WebCharm](https://www.jetbrains.com/webstorm/) + [TONGYI Lingma](https://plugins.jetbrains.com/plugin/17809-tongyi-lingma--your-ai-coding-assistant-type-less-code-more-)

## 项目安装

```sh
npm install
```

### 开发环境的编译与热重载

```sh
npm run dev
```

### 生产环境的构建

```sh
npm run build
```

### 使用 [Vitest](https://vitest.dev/) 进行单元测试

```sh
npm run test:unit
```

### 使用 [Playwright](https://playwright.dev) 进行端对端测试

```sh
# 开始之前先安装浏览器
npx playwright install

# 在开始只想测试的命令行工具前，须先构建项目
npm run build

# 进行端对端测试
npm run test:e2e
# 仅对 Chromium 进行测试
npm run test:e2e -- --project=chromium
# 针对指定文件的测试
npm run test:e2e -- tests/example.spec.ts
# 在调试模式下测试
npm run test:e2e -- --debug
```

### 使用 [ESLint](https://eslint.org/) 进行语法检查

```sh
npm run lint
```
