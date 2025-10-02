#!/bin/bash

# 測試GitHub Actions Release流程的腳本
# 使用方法: ./scripts/test-release.sh [version]

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 獲取版本號
VERSION=${1:-"v1.0.0-test"}

echo -e "${BLUE}🚀 開始測試Release流程...${NC}"
echo -e "${YELLOW}版本: ${VERSION}${NC}"
echo ""

# 檢查是否在git倉庫中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ 錯誤: 不在git倉庫中${NC}"
    exit 1
fi

# 檢查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  警告: 有未提交的更改${NC}"
    echo "建議先提交所有更改再創建tag"
    echo ""
fi

# 檢查GitHub Actions文件是否存在
if [ ! -f ".github/workflows/release.yml" ]; then
    echo -e "${RED}❌ 錯誤: .github/workflows/release.yml 不存在${NC}"
    exit 1
fi

if [ ! -f ".github/workflows/simple-release.yml" ]; then
    echo -e "${RED}❌ 錯誤: .github/workflows/simple-release.yml 不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✅ GitHub Actions文件檢查通過${NC}"

# 檢查package.json中的腳本
if ! grep -q '"type-check"' package.json; then
    echo -e "${YELLOW}⚠️  警告: package.json中沒有type-check腳本${NC}"
fi

if ! grep -q '"build"' package.json; then
    echo -e "${RED}❌ 錯誤: package.json中沒有build腳本${NC}"
    exit 1
fi

echo -e "${GREEN}✅ package.json腳本檢查通過${NC}"

# 本地構建測試
echo -e "${BLUE}🔨 執行本地構建測試...${NC}"
echo ""

echo -e "${YELLOW}📦 安裝依賴...${NC}"
npm ci

echo -e "${YELLOW}🔍 類型檢查...${NC}"
npm run type-check

echo -e "${YELLOW}🏗️  構建項目...${NC}"
npm run build

echo -e "${GREEN}✅ 本地構建測試通過${NC}"
echo ""

# 檢查構建結果
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ 錯誤: dist目錄不存在，構建失敗${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 構建文件檢查通過${NC}"
echo ""

# 檢查是否已經存在該tag
if git tag -l | grep -q "^${VERSION}$"; then
    echo -e "${YELLOW}⚠️  警告: tag ${VERSION} 已經存在${NC}"
    echo "是否要刪除並重新創建? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        git tag -d "${VERSION}" 2>/dev/null || true
        echo -e "${GREEN}✅ 已刪除本地tag${NC}"
    else
        echo -e "${BLUE}ℹ️  跳過tag創建${NC}"
        exit 0
    fi
fi

# 創建tag
echo -e "${BLUE}🏷️  創建tag: ${VERSION}${NC}"
git tag -a "${VERSION}" -m "Test release ${VERSION}"

echo -e "${GREEN}✅ Tag創建成功${NC}"
echo ""

# 顯示下一步操作
echo -e "${BLUE}📋 下一步操作:${NC}"
echo "1. 推送tag到GitHub:"
echo -e "   ${YELLOW}git push origin ${VERSION}${NC}"
echo ""
echo "2. 查看GitHub Actions執行狀態:"
echo -e "   ${YELLOW}https://github.com/[您的用戶名]/[您的倉庫名]/actions${NC}"
echo ""
echo "3. 檢查release分支:"
echo -e "   ${YELLOW}git checkout release${NC}"
echo ""

# 詢問是否立即推送
echo -e "${BLUE}是否要立即推送tag到GitHub? (y/N)${NC}"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🚀 推送tag到GitHub...${NC}"
    git push origin "${VERSION}"
    echo -e "${GREEN}✅ Tag推送成功！${NC}"
    echo ""
    echo -e "${BLUE}🎉 GitHub Actions將自動開始執行${NC}"
    echo "請前往Actions頁面查看執行狀態"
else
    echo -e "${BLUE}ℹ️  您可以稍後手動推送tag${NC}"
fi

echo ""
echo -e "${GREEN}🎉 測試完成！${NC}"
