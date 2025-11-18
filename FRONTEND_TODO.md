# Log Detect Frontend TODO

建立：2025-09-24
狀態：持續更新（請在 PR 中同步勾選進度）

## ✅ 已完成
- [x] 專案骨架：React + TypeScript + Vite + Ant Design
- [x] 路由與版型：私有路由、AntD Layout、Sider 菜單
- [x] 登入流程：`POST /auth/login`，Token 儲存與登出
- [x] Axios 攔截器：夾帶 Bearer、401 自動 `POST /api/v1/auth/refresh`
- [x] Dashboard 範例：`GET /api/v1/Device/count`
- [x] Vite 路徑別名：`@` → `src`

## 🧩 核心模組
### Devices（/api/v1/Device/*）
- [x] 列表：`GET /GetAll`，表格欄位（id、device_group、name）
- [x] 搜尋/篩選：依名稱與群組篩選（前端）
- [x] 分頁與排序：前端控制（Table pagination/sorter）
- [x] 建立：`POST /Create`（單筆以陣列包裝傳送）
- [x] 編輯：`PUT /Update`
- [x] 刪除：`DELETE /Delete/{id}`，含確認視窗
- [x] 群組：`GET /GetGroup` 下拉 + 篩選
- [x] 成功/失敗提示與錯誤顯示（AntD message）
 - [x] 佈局優化：整合群組統計卡片至頁面頂部；設備清單改為表格+分頁（移除 ID 欄位）
  - [x] UX：點擊群組卡片可直接切換/取消該群組的清單篩選

### Targets（/api/v1/Target/*）
- [x] 列表：`GET /GetAll`，狀態顯示（啟用/停用）
- [x] 建立：`POST /Create`（含選 Index 關聯）
- [x] 編輯：`PUT /Update`
- [x] 刪除：`DELETE /Delete/{id}`
- [x] 表單驗證：主旨、收件人必填
- [ ] 關聯保存強化：確保後端更新時同步重建 many2many（視後端支援）

### Receivers（/api/v1/Receiver/*）
- [x] 列表：`GET /GetAll`
- [x] 建立：`POST /Create`
- [x] 編輯：`PUT /Update`
- [x] 刪除：`DELETE /Delete/{id}`
- [ ] 測試通知：送測試信/測試渠道（若後端支持）

### Indices（/api/v1/Indices/*）
- [x] 列表：`GET /GetAll`
- [x] 建立：`POST /Create`
- [x] 編輯：`PUT /Update`
- [x] 刪除：`DELETE /Delete/{id}`
- [x] 依 Logname 查：`GET /GetIndicesByLogname/{logname}`（頁面下拉篩選）
- [ ] 依 TargetID 查：`GET /GetIndicesByTargetID/{id}`
- [x] Logname 清單：`GET /GetLogname`
 - [x] UI 同步：Indices 不顯示任何啟用欄位（狀態由 Target 控制）
 - [x] 互動優化：新增時 Logname 可自行輸入（AutoComplete），Device Group 僅能從既有群組下拉選擇

### History（/api/v1/History/*）
- [x] Logname 清單與搜尋條件（日期範圍、關鍵字 - 前端過濾）
- [x] 查詢：`GET /GetData/{logname}`、`GET /GetLognameData`
- [x] 顯示：表格 + 狀態統計標籤 + 時間軸圖（每設備/每分鐘格狀顯示）
 - [x] 匯出：CSV（前端匯出）
 - [x] 時間刻度優化：整點粗線、半點細線，可配置刻度間距 
 - [x] 快捷區間：近 1/3/6 小時、全天
 - [x] 快捷區間高亮：顯示目前選取的快捷鍵
 - [x] 移除自定義日期區塊：以快捷區間為主，最長一天

### Elasticsearch 監控（/api/v1/elasticsearch/*）
- [x] Monitors：列表 / 搜尋 / 建立 / 編輯 / 刪除 / Toggle / Test API 對接
- [x] 閾值設定：抽屜表單含去重窗口、9 項閾值欄位與模板 Segmented
- [ ] 通知設定：`setNotifTarget` 狀態管理、`receivers` JSON 字串序列化、測試信流程
- [x] Dashboard Overview：統計卡片（`GET /statistics`）+ 狀態列表（`GET /status`）+ 自動刷新 / 狀態篩選
- [ ] 狀態歷史：`GET /status/{id}/history` 時序視覺化與篩選
  - [x] 頁面骨架：監控器篩選 + 時段切換 + 指標 sparkline + 明細表格
- [ ] 告警管理：`/alerts` 列表、篩選、Resolve / Acknowledge 操作
  - [x] 頁面骨架：複合篩選、統計卡片、告警表格、處理流程對話框
- [ ] 指標分析：Indices / Shards 專頁內容與對應 API 呈現

## 🧭 總覽頁（Dashboard）
- [x] 暫時留白，待日後規劃其他內容（群組統計已移至設備頁）

### Users & Auth（/api/v1/auth/*）
- [ ] 目前使用者：`GET /profile`（頁面顯示與快取）
- [x] 使用者列表：`GET /users`
- [x] 取單一使用者：`GET /users/{id}`
- [x] 更新：`PUT /users/{id}`（角色切換）
- [x] 刪除：`DELETE /users/{id}`
- [x] 註冊：`POST /register`（限 Admin）

## 🧱 共用與底層
- [x] OpenAPI 型別與 Client：`npm run gen:api` 產生到 `src/api/generated`，以產生 client 取代手寫呼叫
- [ ] 統一錯誤處理：解析後端 `ErrorResponse`，封裝 `message/notification`
- [ ] 分頁/查詢 Hook：表格分頁、排序、篩選與 URL Query 同步
- [ ] 共用表單元件：欄位布局、必填與格式驗證（Email、數字、JSON、日期）
- [ ] 載入/空狀態：全域 Loading 與 Empty 組件
- [ ] 權限控制：基於使用者角色/權限隱藏按鈕與路由（對應後端 `PermissionMiddleware`）

## 🧭 導覽與動態化
- [ ] 動態選單：整合 `GET /api/v1/user/get-server-menu`、`GET /api/v1/get-server-module` 產生 Sider 菜單
- [ ] 麵包屑與標題：依路由配置動態顯示
- [ ] 語系：以 zh-TW 為主，預留 i18n 架構（可選）

## 🧪 測試與品質
- [ ] 單元測試（可選）：關鍵函式與 Hook
- [ ] E2E 測試（可選）：登入、Devices CRUD 主流程
- [ ] 型別嚴格：提高 TS 嚴格度，避免 `any`
- [ ] Lint/Format（可選）：ESLint + Prettier（若導入，需專案一致）

## 🚀 建置與部署
- [ ] 開發：Vite proxy（必要時用 proxy 取代寬鬆 CORS）
- [ ] 打包：`npm run build`，檔案體積檢查
- [ ] 部署：靜態資源服務設定、與後端路徑協調（`/auth`、`/api`）
- [ ] 環境變數：`.env.production` 的 `VITE_API_BASE_URL`

## 📌 里程碑建議
1) M1（Devices MVP）
- [ ] Devices 列表/搜尋/分頁
- [ ] 新增/編輯/刪除 + 成功提示
- [ ] OpenAPI 型別導入於 Devices

2) M2（Targets/Receivers/Indices）
- [ ] 三模組 CRUD 與關聯選擇
- [ ] 統一錯誤處理與表單驗證

3) M3（History + 圖表 + Users）
- [ ] History 查詢與圖表化
- [ ] Users 管理 + 權限控制
- [ ] 動態選單整合

---
備註：後端 OpenAPI 契約位於 `../log-detect-backend/docs/openapi.yml`，請變更 API 後同步更新並重新產生型別。
