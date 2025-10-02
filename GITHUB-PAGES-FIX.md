# GitHub Pages 自動部署問題解決方案

## 🔍 問題描述

您遇到的 "pages build and deployment" 工作流程一直自動執行，這是因為GitHub Pages功能被啟用但配置不正確導致的。

## 🛠️ 解決方案

### 方案1：完全禁用GitHub Pages（推薦）

如果您不需要將專案部署為靜態網站：

1. **前往GitHub倉庫設置**：
   - 進入您的GitHub倉庫
   - 點擊 "Settings" 標籤

2. **關閉Pages功能**：
   - 在左側選單中找到 "Pages" 選項
   - 在 "Source" 部分選擇 "None"
   - 點擊 "Save" 保存設置

3. **確認結果**：
   - 關閉後就不會再有自動的Pages部署工作流程
   - 只會保留您的 `release.yml` 工作流程

### 方案2：正確配置GitHub Pages

如果您需要Pages功能：

1. **使用我們提供的配置**：
   - 使用 `.github/workflows/pages.yml` 文件
   - 這個配置只在 `dist/` 目錄變更時才部署

2. **設置Pages源**：
   - 前往 Settings → Pages
   - 在 "Source" 部分選擇 "GitHub Actions"
   - 保存設置

3. **觸發條件**：
   - 只在推送到main分支且dist目錄有變更時觸發
   - 避免不必要的部署

## 📋 當前工作流程狀態

### 您的主要工作流程：
- ✅ **`.github/workflows/release.yml`** - 只在tag推送時觸發
- ❌ **GitHub Pages自動部署** - 每次推送main分支都觸發（問題所在）

### 建議配置：
- 保留 `release.yml` 用於版本發布
- 禁用或正確配置Pages部署

## 🎯 推薦操作

1. **立即操作**：
   ```bash
   # 提交這些配置文件
   git add .
   git commit -m "fix: 添加Pages部署配置和說明"
   git push origin main
   ```

2. **前往GitHub設置**：
   - 關閉Pages功能（方案1）
   - 或配置為使用GitHub Actions（方案2）

3. **驗證結果**：
   - 檢查Actions頁面，應該只看到release工作流程
   - 不會再有自動的Pages部署

## ⚠️ 注意事項

- GitHub Pages的自動部署是GitHub的內建功能
- 無法通過工作流程文件直接禁用
- 必須在倉庫設置中手動關閉
- 我們的 `release.yml` 工作流程不會受到影響

## 🔗 相關鏈接

- [GitHub Pages 設置](https://github.com/您的用戶名/您的倉庫名/settings/pages)
- [GitHub Actions 文檔](https://docs.github.com/en/actions)
