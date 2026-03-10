# 注意事項

- 使用VueJS 3
- 使用vite而非vue cli建立專案
- 使用pinia做狀態管理，而非vuex
- 使用Composition API的寫法
- 使用TypeScript strict mode，盡量不宣告any type，以便後續維護。
- cypress如何使用待測試
- 套件選用(例如data table等)需考慮是否還有在維護(一年內還有持續更新)，是否足夠熱門(github star 1k+)。否則會考慮自己刻，不然以後每年弱掃搞不完。
- 套用coreUi(https://coreui.io/angular/docs/templates/admin-dashboard/)
- 套用icon(https://remixicon.cn/)

## IDE Setup

為了code style一制性，要求使用VSCode當作IDE

需安裝以下extendsion

Vue - official, ESLint, Prettier - Code formatter

## 開發說明

- [按鈕使用與新增指南](docs/BUTTON_ADD_GUIDE.md)

# 目錄結構

- cypress: 測試
- src

  - assets: static的資料，css,img等
  - components: 各種組件template
    - query: 查詢相關組件
      - QueryCriteriaComponenet: 查詢條件主要組件
      - QueryInputDate: 查詢條件日期組件
      - QueryInputText: 查詢條件文字組件
      - QueryInputSelect: 查詢條件下拉選單組件
      - QueryButton: 查詢條件按鈕組件
    - **tests**: vitest 测试类
    - dataTable：分页table组件
    - icons：图标icons组件
    - HeaderComponent.vue：页面顶部控件，显示用户名等
    - MenuBarComponent.vue：菜单控件
    - formTable: form表单组件
      - FormComponent: form弹窗组件
      - FormInput：form输入框组件
      - FormImgFile：form 上传图片组件
      - FormFile：form 上传文件组件
      - FormButton：form按钮组件
  - hooks: 部分通用后端API
  - layout: 排版
    - HomeView.vue: 主要排版
  - locales: 多語系，語系檔命名需要與springboot i18n一致
    - index.ts：整合多语言引入
    - lang：
      - en_US:英文
      - zh_CN：中文简体
      - zh_TW：中文繁体
  - mocks: vitest测试使用mock,使用MSW
    - mock：各模组mock API
    - setupTests.ts：test server处理
    - server：Set up MSW server
    - handlers.ts：整合所有mock API到MSW
  - plugins: 第三方插件的注册和配置
    - index.ts: 各组件统一set up
    - permission.ts：登录动态路由处理
    - swalMessage.ts：提示弹窗
  - router: router設定
    - index.ts: VUE 基础router
  - stores: pinia全域狀態管理，各類狀態放這邊
    - user.ts: user的各種資料，類似session data。主要透過authUserUtils操作
    - app.ts: 通用属性配置，例如语系、单/多机构、主题
    - index.ts: pinia持久化
    - useColorModes.ts：管理主题
  - utils: 各種util
    - select：下拉框 util
    - apiUtils.ts: 包裝過後的api(包含驗證token等, todo)
    - appProperties.ts: 共用的寫死properties(ex:支援語系列表、時區列表)
    - authUserUtils.ts: 對登入user的資料存取
    - util.ts：公共util
  - views: (命名規則: 后端 href + COMPONENT)
    - hosted: hosted功能的view
    - issuer: issuer功能的view
    - 404View.vue: 404 error page
    - LoginView.vue: 登录页
  - config.ts: 承接原先.env的參數。本檔案內僅能設置可公開變數，secret勿放置於此。主要作用為可直接吃環境參數，而非變更參數就需要重新打包

- .env: 環境變數檔
- .env.test: 测试環境變數檔
- vite.config.ts: api proxy設定
- vitest.config.ts: vitest测试配置（https://test-utils.vuejs.org/guide/advanced/http-requests.html）

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Run Check then fix -- npm audit fix

```sh
npm audit
```

```sh
npm run format
```

```sh
npm run prettier:check
```

### 檢查並更新依賴版本 (npm-check-updates)

檢查 `package.json` 內套件是否有新版本，並直接更新 `package.json` 的版本範圍（需再執行 `npm install` 安裝新版本）：

```sh
npx npm-check-updates -u
```

更新後請執行 `npm install` 安裝新版本。

### 佈版emv環境

```

npm run build:emv

# push to cloud strage
gsutil -m cp -r dist gs://emv-product/acs-admin-frontend

# pull to vm(nginx)
sudo gsutil -m cp -r gs://emv-product/acs-admin-frontend/dist/* /var/www/acs-admin-frontend/acs-admin

```

# env變更

### - 程式調整

`import.meta.env.VITEXXXX` 改為

```
import { appConfig, type PublicConfig } from '@/config'
appConfig.XXXX
```

### - 原.env參數檔可用於開發

### - src/config.ts, 僅能設置可公開變數，secret勿放置於此

# docker範例，參數使用外部引入

docker包版過程中會塞入一個替換過環境變數的 ./app-config.js 於 index.html內

```bash
docker build -t my-vue-app .

docker run --name my-vue-app --rm -p 8080:8080 \
-e VUE_API_BASE_URL=http://127.0.0.1:8080/acs-admin \
-e VUE_FRONTEND_CONTEXT_PATH=/acs-admin \
-e VUE_FRONTEND_PORT=8080 \
-e VUE_BACKEND_API_TIMEOUT=300000 \
-e VUE_PAGE_SIZE=10 \
-e STAGE=dev \
-e NGINX_ADMIN_FRONTEND_CONTEXT_PATH=/acs-admin \
-e NGINX_ADMIN_BACKEND_HOST=host.docker.internal \
-e NGINX_ADMIN_BACKEND_PORT=8070 \
-e NGINX_ADMIN_BACKEND_CONTEXT_PATH=/acs-admin-backend \
my-vue-app



docker exec -it my-vue-app /bin/sh


http://127.0.0.1:8080/acs-admin/#/hosted/login
http://127.0.0.1:8080/acs-admin/#/issuer/login
```
