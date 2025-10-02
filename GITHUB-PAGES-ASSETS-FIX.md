# GitHub Pages 靜態資源路徑問題解決方案

## 🔍 問題描述

部署到GitHub Pages後，網站抓不到樣式檔案（CSS、JS等），頁面顯示沒有樣式。

**常見錯誤**：
- 樣式檔案載入失敗（404錯誤）
- 資源路徑不正確
- 頁面顯示為純HTML，沒有樣式

## 🎯 問題原因

GitHub Pages的URL結構與本地開發不同：
- **本地開發**：`http://localhost:3000/`
- **GitHub Pages**：`https://您的用戶名.github.io/倉庫名/`

Vite需要知道正確的base路徑才能生成正確的資源路徑。

## ✅ 解決方案

### 1. 修復Vite配置

我已經更新了 `vite.config.ts`：

```typescript
export default defineConfig(({ command, mode }) => {
  // 根據環境設置base路徑
  const base = mode === 'production' ? '/Mahjong-Point-Counting/' : '/'
  
  return {
    base, // 關鍵設置
    // ... 其他配置
  }
})
```

### 2. 配置說明

**base路徑設置**：
- **開發環境**：`base: '/'` （本地開發）
- **生產環境**：`base: '/Mahjong-Point-Counting/'` （GitHub Pages）

**為什麼需要這個設置**：
- 告訴Vite在生產環境中所有資源的基礎路徑
- 確保CSS、JS、圖片等資源能正確載入

### 3. 資源路徑對比

**修復前**（錯誤）：
```html
<link rel="stylesheet" href="/assets/index.css">
<script src="/assets/index.js"></script>
```

**修復後**（正確）：
```html
<link rel="stylesheet" href="/Mahjong-Point-Counting/assets/index.css">
<script src="/Mahjong-Point-Counting/assets/index.js"></script>
```

## 🚀 測試修復

### 1. 本地測試

```bash
# 測試生產環境構建
npm run build
npm run preview

# 檢查dist/index.html中的路徑是否正確
```

### 2. 部署測試

```bash
# 發布新版本
npm run version:patch

# 等待部署完成後檢查網站
```

### 3. 檢查結果

**成功的標誌**：
- ✅ 網站正常顯示樣式
- ✅ 所有資源正確載入
- ✅ 開發者工具中沒有404錯誤

## 🔧 其他解決方案

### 方案1：使用自定義域名

如果您有自定義域名：

```typescript
// vite.config.ts
export default defineConfig({
  base: '/', // 使用根路徑
  // ...
})
```

然後在GitHub Pages設置中添加自定義域名。

### 方案2：使用環境變量

創建 `.env.production` 文件：

```bash
# .env.production
VITE_BASE_PATH=/Mahjong-Point-Counting/
```

### 方案3：動態base路徑

```typescript
// vite.config.ts
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  // ...
})
```

## 📋 常見問題

### 問題1：修復後仍然沒有樣式

**解決方案**：
1. 清除瀏覽器緩存
2. 檢查GitHub Pages是否更新
3. 確認構建成功

### 問題2：本地開發受影響

**解決方案**：
- 開發環境使用 `base: '/'`
- 生產環境使用 `base: '/Mahjong-Point-Counting/'`

### 問題3：其他資源載入失敗

**解決方案**：
- 檢查所有靜態資源路徑
- 確保public目錄中的文件正確處理

## 🎯 驗證步驟

### 1. 檢查構建輸出

```bash
npm run build
# 檢查dist/index.html中的資源路徑
```

### 2. 檢查部署結果

1. 前往GitHub Pages網站
2. 按F12打開開發者工具
3. 查看Network標籤，確認沒有404錯誤
4. 檢查Elements標籤，確認CSS正確載入

### 3. 測試功能

- 頁面樣式是否正常
- 互動功能是否正常
- 圖片和圖標是否顯示

## 🔗 相關資源

- [Vite Base選項文檔](https://vitejs.dev/config/shared-options.html#base)
- [GitHub Pages部署指南](https://docs.github.com/en/pages)
- [靜態資源處理](https://vitejs.dev/guide/assets.html)

## 📞 故障排除

如果問題仍然存在：

1. **檢查GitHub Actions日誌**：確認構建成功
2. **檢查網站URL**：確認訪問正確的網址
3. **清除緩存**：瀏覽器和CDN緩存
4. **檢查倉庫名稱**：確認base路徑與倉庫名稱一致

修復完成後，您的GitHub Pages網站應該能正確載入所有樣式和資源了！
