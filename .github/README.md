# GitHub Actions 自動化部署

本專案包含兩個GitHub Actions工作流程，用於自動化構建和部署：

## 🚀 工作流程

### 1. Release Build (完整版)
**文件**: `.github/workflows/release.yml`

**功能**:
- ✅ 類型檢查
- ✅ 構建項目
- ✅ 創建發布說明
- ✅ 推送到release分支
- ✅ 自動創建GitHub Release

**觸發條件**: 推送tag（格式：v*，如 v1.0.0）

### 2. Simple Release (簡化版)
**文件**: `.github/workflows/simple-release.yml`

**功能**:
- ✅ 構建項目
- ✅ 推送到release分支

**觸發條件**: 推送tag（格式：v*，如 v1.0.0）

## 📋 使用方法

### 創建並推送tag

```bash
# 1. 創建tag
git tag v1.0.0

# 2. 推送tag到GitHub
git push origin v1.0.0
```

### 或者使用註解tag

```bash
# 1. 創建帶註解的tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# 2. 推送tag到GitHub
git push origin v1.0.0
```

## 🔧 配置說明

### 觸發條件
**重要**：GitHub Actions **僅在推送tag時觸發**，不會在普通git push時執行：

```bash
# ✅ 會觸發GitHub Actions
git tag v1.0.0
git push origin v1.0.0

# ❌ 不會觸發GitHub Actions
git push origin main
git push origin develop
```

**支持的tag格式**：
- 當您推送以 `v` 開頭的tag時會自動觸發
- 例如：`v1.0.0`, `v1.2.3`, `v2.0.0-beta`

**觸發配置**：
```yaml
on:
  push:
    tags:
      - 'v*'  # 只匹配以v開頭的tag，不包含branches配置
```

### 構建環境
- **運行環境**: Ubuntu Latest
- **Node.js版本**: 18
- **構建工具**: npm

### 輸出結果
1. **構建文件**: 推送到 `release` 分支
2. **GitHub Release**: 自動創建發布版本
3. **構建日誌**: 在Actions頁面查看

## 📁 Release分支結構

```
release/
├── dist/              # 構建後的靜態文件
├── index.html         # 主頁面
├── package.json       # 項目配置
├── README.md          # 項目說明
└── RELEASE_NOTES.md   # 發布說明（完整版）
```

## 🛠️ 自定義配置

### 修改Node.js版本
在workflow文件中修改：
```yaml
node-version: '18'  # 改為您需要的版本
```

### 修改tag格式
在workflow文件中修改：
```yaml
tags:
  - 'v*'     # 當前：v開頭的tag
  - 'v*.*.*' # 改為：嚴格的三位版本號
  - '*'      # 改為：所有tag
```

### 修改分支名稱
將所有的 `release` 替換為您想要的分支名稱。

## 📊 監控和調試

### 查看構建狀態
1. 進入GitHub倉庫
2. 點擊 "Actions" 標籤
3. 查看工作流程執行狀態

### 常見問題
1. **構建失敗**: 檢查Node.js版本和依賴
2. **推送失敗**: 確認有推送權限
3. **Release創建失敗**: 檢查GITHUB_TOKEN權限
4. **Git操作失敗**: 如果遇到 `git rm -rf .` 錯誤，使用 `robust-release.yml`

### 工作流程選擇
- **auto-release.yml**: 最新穩定版本，完全修復Git操作問題（強烈推薦）
- **release.yml**: 完整功能，包含GitHub Release創建
- **simple-release.yml**: 簡化版本，只推送構建文件
- **robust-release.yml**: 穩健版本，避免Git操作問題

### 故障排除
如果遇到Git操作錯誤，建議：
1. 刪除或重命名其他工作流程文件
2. 只保留 `auto-release.yml` 工作流程
3. 重新推送tag觸發構建

## 🔒 權限要求

確保GitHub Actions有以下權限：
- ✅ 讀取倉庫內容
- ✅ 推送代碼到分支
- ✅ 創建Release

## 📝 最佳實踐

1. **使用語義化版本**: `v1.0.0`, `v1.1.0`, `v2.0.0`
2. **添加tag註解**: `git tag -a v1.0.0 -m "重要更新"`
3. **測試構建**: 在本地運行 `npm run build` 確保無錯誤
4. **檢查輸出**: 構建完成後檢查release分支內容

---

**注意**: 首次使用時，建議先在測試倉庫中驗證工作流程的正確性。
