# GitHub Actions 權限問題解決方案

## 🔍 問題描述

您遇到的錯誤：
```
remote: Permission to mao0507/Mahjong-Point-Counting.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/mao0507/Mahjong-Point-Counting/': The requested URL returned error: 403
```

這是因為GitHub Actions沒有足夠的權限推送到您的倉庫。

## ✅ 解決方案

### 方案1：使用GITHUB_TOKEN（推薦）

我已經在workflow中添加了正確的權限配置：

```yaml
permissions:
  contents: write  # 允許推送代碼
  pages: write     # 允許部署到Pages
  id-token: write  # 允許身份驗證
```

### 方案2：檢查倉庫權限設置

1. **前往倉庫設置**：
   - 進入您的GitHub倉庫
   - 點擊 "Settings" → "Actions" → "General"

2. **檢查權限設置**：
   - 找到 "Workflow permissions"
   - 選擇 "Read and write permissions"
   - 勾選 "Allow GitHub Actions to create and approve pull requests"
   - 點擊 "Save"

### 方案3：使用Personal Access Token（如果需要）

如果上述方案無效，可以創建Personal Access Token：

1. **創建Token**：
   - 前往 GitHub → Settings → Developer settings → Personal access tokens
   - 點擊 "Generate new token (classic)"
   - 選擇 "repo" 權限
   - 複製生成的token

2. **添加Secret**：
   - 前往倉庫 Settings → Secrets and variables → Actions
   - 點擊 "New repository secret"
   - Name: `PERSONAL_ACCESS_TOKEN`
   - Value: 貼上您的token

3. **修改workflow**：
```yaml
- name: Push to release branch
  run: |
    git push origin release
  env:
    GITHUB_TOKEN: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```

## 🔧 我已經修復的問題

### 1. 添加了正確的權限配置

在 `release.yml` 中添加了：
```yaml
permissions:
  contents: write
  pages: write
  id-token: write
```

### 2. 確保使用GITHUB_TOKEN

GitHub Actions會自動使用 `GITHUB_TOKEN`，這個token具有必要的權限。

## 🚀 測試修復

### 提交修復
```bash
git add .github/workflows/release.yml
git commit -m "fix: 修復GitHub Actions權限問題"
git push origin main
```

### 測試部署
```bash
# 發布新版本測試
npm run version:patch
```

### 檢查結果
1. 前往GitHub Actions頁面
2. 查看release工作流程是否成功執行
3. 確認沒有權限錯誤

## 📋 權限說明

### contents: write
- 允許讀取和寫入倉庫內容
- 允許推送到分支
- 允許創建和更新文件

### pages: write
- 允許部署到GitHub Pages
- 允許上傳構建文件
- 允許管理Pages設置

### id-token: write
- 允許使用OIDC進行身份驗證
- 提高安全性
- 現代GitHub Actions的最佳實踐

## ⚠️ 常見問題

### 問題1：仍然出現403錯誤
**解決方案**：
1. 檢查倉庫是否為私有倉庫
2. 確認您的GitHub帳戶有足夠的權限
3. 檢查是否有組織級別的權限限制

### 問題2：GITHUB_TOKEN過期
**解決方案**：
- GITHUB_TOKEN會自動刷新，無需手動處理
- 如果仍有問題，請檢查倉庫設置

### 問題3：組織倉庫權限限制
**解決方案**：
1. 聯繫組織管理員
2. 請求必要的權限
3. 或將倉庫轉移到個人帳戶

## 🎯 驗證修復

修復完成後，您應該看到：

1. ✅ **Release工作流程成功執行**
2. ✅ **成功推送到release分支**
3. ✅ **Pages部署工作流程觸發**
4. ✅ **網站正常部署**

## 📞 進一步支援

如果問題仍然存在：

1. **檢查GitHub Actions日誌**：查看詳細的錯誤信息
2. **檢查倉庫設置**：確認權限配置正確
3. **聯繫GitHub支援**：如果是平台問題

## 🔗 相關鏈接

- [GitHub Actions權限文檔](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [Workflow權限設置](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions)
- [Personal Access Token指南](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
