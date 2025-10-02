# 版本管理腳本說明

本目錄包含多個版本管理和發布腳本，幫助您自動化版本號更新和Git tag創建。

## 📁 腳本列表

### 1. version-manager.sh (完整版 - 推薦)
**文件**: `scripts/version-manager.sh`

**功能**:
- ✅ 自動檢測當前版本號
- ✅ 支援多種版本更新類型
- ✅ 自動更新package.json
- ✅ 創建Git提交和tag
- ✅ 互動式確認和錯誤處理
- ✅ 自動推送到GitHub（可選）

**使用方法**:
```bash
# 修補版本 (1.0.0 → 1.0.1)
./scripts/version-manager.sh patch

# 次要版本 (1.0.0 → 1.1.0)
./scripts/version-manager.sh minor

# 主要版本 (1.0.0 → 2.0.0)
./scripts/version-manager.sh major

# 自定義版本
./scripts/version-manager.sh custom 2.1.5
```

### 2. version-manager.js (Node.js版 - 跨平台)
**文件**: `scripts/version-manager.js`

**功能**:
- ✅ 跨平台支援（Windows/Mac/Linux）
- ✅ 自動版本號計算
- ✅ 完整的錯誤處理
- ✅ 彩色輸出

**使用方法**:
```bash
# 修補版本
node scripts/version-manager.js patch

# 次要版本
node scripts/version-manager.js minor

# 主要版本
node scripts/version-manager.js major

# 自定義版本
node scripts/version-manager.js custom 2.1.5
```

### 3. quick-release.sh (快速版)
**文件**: `scripts/quick-release.sh`

**功能**:
- ✅ 快速版本更新
- ✅ 簡潔的操作流程
- ✅ 適合日常使用

**使用方法**:
```bash
# 修補版本
./scripts/quick-release.sh patch

# 次要版本
./scripts/quick-release.sh minor "重要功能更新"

# 主要版本
./scripts/quick-release.sh major "重大版本發布"
```

### 4. test-release.sh (測試版)
**文件**: `scripts/test-release.sh`

**功能**:
- ✅ 測試GitHub Actions流程
- ✅ 本地構建驗證
- ✅ 創建測試tag

**使用方法**:
```bash
# 創建測試版本
./scripts/test-release.sh v1.0.0-test
```

## 🎯 版本號規則

### 語義化版本 (Semantic Versioning)
- **主要版本 (major)**: 不兼容的API修改
- **次要版本 (minor)**: 向下兼容的功能性新增
- **修補版本 (patch)**: 向下兼容的問題修復

### 版本號格式
```
主版本號.次版本號.修訂號
例如: 1.2.3
```

## 🚀 完整發布流程

### 1. 開發階段
```bash
# 開發功能...
git add .
git commit -m "feat: 新增某某功能"
```

### 2. 版本更新
```bash
# 使用腳本更新版本
./scripts/version-manager.sh patch
```

### 3. 推送到GitHub
```bash
# 腳本會自動提示，或手動推送
git push origin main
git push origin v1.0.1
```

### 4. 自動部署
- GitHub Actions自動檢測tag
- 自動構建項目
- 推送到release分支
- 創建GitHub Release

## 📋 腳本功能對比

| 功能 | version-manager.sh | version-manager.js | quick-release.sh | test-release.sh |
|------|-------------------|-------------------|------------------|-----------------|
| 版本檢測 | ✅ | ✅ | ✅ | ✅ |
| 版本計算 | ✅ | ✅ | ✅ | ❌ |
| 更新package.json | ✅ | ✅ | ✅ | ❌ |
| 創建Git提交 | ✅ | ✅ | ✅ | ✅ |
| 創建Git tag | ✅ | ✅ | ✅ | ✅ |
| 錯誤處理 | ✅ | ✅ | ❌ | ✅ |
| 互動確認 | ✅ | ❌ | ❌ | ✅ |
| 自動推送 | ✅ | ❌ | ❌ | ❌ |
| 跨平台支援 | ❌ | ✅ | ❌ | ❌ |

## 🔧 自定義配置

### 修改預設行為
編輯腳本文件中的以下部分：

```bash
# 修改預設版本類型
VERSION_TYPE=${1:-"minor"}  # 改為minor

# 修改Git用戶信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 添加自定義檢查
在腳本中添加您的檢查邏輯：

```bash
# 檢查測試是否通過
npm test || {
    echo "❌ 測試失敗，無法發布版本"
    exit 1
}
```

## 🛠️ 故障排除

### 常見問題

1. **權限錯誤**
   ```bash
   chmod +x scripts/*.sh
   ```

2. **Git錯誤**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **Node.js錯誤**
   ```bash
   # 確保Node.js已安裝
   node --version
   npm --version
   ```

4. **Tag已存在**
   - 腳本會自動檢測並詢問是否刪除
   - 或手動刪除：`git tag -d v1.0.0`

### 調試模式
```bash
# 啟用調試輸出
set -x
./scripts/version-manager.sh patch
set +x
```

## 📝 最佳實踐

1. **版本命名**:
   - 使用語義化版本號
   - 主要版本：重大變更
   - 次要版本：新功能
   - 修補版本：錯誤修復

2. **發布流程**:
   - 先完成所有開發工作
   - 運行測試確保品質
   - 更新版本號
   - 創建tag並推送
   - 監控GitHub Actions執行

3. **文檔更新**:
   - 更新CHANGELOG.md
   - 更新README.md
   - 記錄重要變更

## 🎉 使用建議

- **日常開發**: 使用 `quick-release.sh`
- **正式發布**: 使用 `version-manager.sh`
- **跨平台環境**: 使用 `version-manager.js`
- **測試流程**: 使用 `test-release.sh`

選擇適合您需求的腳本，開始自動化您的版本管理流程！
