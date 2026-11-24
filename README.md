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

## App 掛載契約

App 轉成可掛載模組後，向 `ShellAppRegistry` 註冊 loader。模組只需實作 `mount`，並回傳 `unmount`：

```ts
registry.register('noah-hrm', () => import('./apps/hrm.entry'));
```

```ts
export async function mount(host: HTMLElement, context: ShellAppContext) {
  // 在 host 內啟動 App。
  return {
    unmount() {
      // 釋放 App 的 Angular instance、事件及資源。
    },
  };
}
```

目前尚未註冊既有 App，因此掛載區會顯示遷移提示。這讓 Shell 可以先獨立建置，再逐一遷移 App，不需要一次修改全部專案。
