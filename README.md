Log Detect Frontend (React + TypeScript + Ant Design)

開發指引

- 啟動開發：
  - 先安裝依賴：`npm install`
  - 啟動：`npm run dev`

- 後端 API：
  - 預設 Base URL 由 `.env.development` 的 `VITE_API_BASE_URL` 控制，預設 `http://localhost:8006`
  - 已實作 Axios 攔截器於 `src/api/http.ts`，自動夾帶 Bearer Token，並嘗試 `POST /api/v1/auth/refresh` 自動刷新。

- 登入流程：
  - 於 `src/pages/Login.tsx` 呼叫 `/auth/login`，將 token 與 user 存入 localStorage。
  - 受保護路由由 `src/App.tsx` 的 `PrivateRoute` 控制。

- 頁面路由：
  - Dashboard：`/dashboard`（展示 `/api/v1/Device/count` 範例）
  - Devices：`/devices`
  - Targets：`/targets`
  - Receivers：`/receivers`
  - Indices：`/indices`
  - History：`/history`
  - Users：`/users`

- 產生 API 型別與 Client（選用）：
  - 指令：`npm run gen:api`
  - 需安裝 `openapi-typescript-codegen`，會從 `../log-detect-backend/docs/openapi.yml` 產生到 `src/api/generated`。
  - 產生後可於程式碼中導入型別與 client。

待辦與下一步

- 依 OpenAPI 完成各模組 CRUD（Device/Target/Receiver/Indices/History/User）。
- 導入動態選單：呼叫 `/api/v1/user/get-server-menu` 與 `/api/v1/get-server-module` 動態渲染。
- 權限控制（RBAC）與 UI 顯示狀態整合。
- 歷史查詢圖表化（可用 Ant Design Charts 或 ECharts）。

