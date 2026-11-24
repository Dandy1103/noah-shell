# Noah Shell

Noah Shell 是平台執行期間持續存在的前端外殼。它擁有 Header、Navbar、Sidebar、Catalog 狀態與 App 掛載區；各業務 App 仍擁有自己的畫面、路由與領域邏輯。

`noah-platform` 仍是部署組裝器。未來由 Platform 同時組裝 Shell 與各 App 的編譯產物，不把業務程式碼放進 Platform。

## 開發

```bash
npm install
npm start
```

開發伺服器預設使用 `http://127.0.0.1:8080` 作為 Core。需要不同位置時設定 `CORE_URL`。

```bash
CORE_URL=http://127.0.0.1:8081 npm start
```

## 邊界

Shell 負責：

- 全域 Header、Navbar、Sidebar。
- Catalog 的持久快取與背景重新驗證。
- 跨 App 導航及目前 App 狀態。
- 根據 App manifest 套用全寬或 Sidebar 版型；Portal 使用全寬，其餘業務 App 使用 Sidebar。
- 載入、掛載及卸載業務 App。

Shell 不負責：

- HRM、ERP 等領域資料與畫面。
- 業務 API 或業務授權規則。
- 各 App 的內部狀態。

## App 路由契約

Shell 是唯一擁有瀏覽器網址的 Router。每個業務 App 是 Native Federation remote，只暴露一個很小的 interface：

```ts
export const remoteRoutes: Routes = [
  // App 自己的領域路由。
];
```

Shell 根據第一段網址載入對應 remote。例如 `/hrm/employees` 由 Shell 選擇 `noah-hrm`，再把 `employees` 交給 HRM 的 `remoteRoutes`。業務 App 不再啟動第二個 Router，也不再渲染 Header、Navbar 或 Sidebar。

部署時，Shell 位於網站根目錄，remote 位於 `/remotes/<route>/`。開發時可以分別啟動 Shell 與各 remote，Shell 的 proxy 會使用相同公開路徑。
