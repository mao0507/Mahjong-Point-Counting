#!/bin/bash

# 自動版本管理和Git tag腳本
# 使用方法: ./scripts/version-manager.sh [major|minor|patch|custom] [custom-version]

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 獲取參數
VERSION_TYPE=${1:-"patch"}
CUSTOM_VERSION=${2:-""}

# 獲取當前版本
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}🔍 當前版本: ${CYAN}${CURRENT_VERSION}${NC}"

# 解析版本號
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

# 計算新版本號
case $VERSION_TYPE in
    "major")
        NEW_VERSION="$((MAJOR + 1)).0.0"
        echo -e "${YELLOW}📈 主要版本更新: ${MAJOR} → $((MAJOR + 1))${NC}"
        ;;
    "minor")
        NEW_VERSION="${MAJOR}.$((MINOR + 1)).0"
        echo -e "${YELLOW}📈 次要版本更新: ${MINOR} → $((MINOR + 1))${NC}"
        ;;
    "patch")
        NEW_VERSION="${MAJOR}.${MINOR}.$((PATCH + 1))"
        echo -e "${YELLOW}📈 修補版本更新: ${PATCH} → $((PATCH + 1))${NC}"
        ;;
    "custom")
        if [ -z "$CUSTOM_VERSION" ]; then
            echo -e "${RED}❌ 錯誤: 使用custom模式時必須提供自定義版本號${NC}"
            echo "使用方法: $0 custom 2.1.5"
            exit 1
        fi
        NEW_VERSION="$CUSTOM_VERSION"
        echo -e "${YELLOW}📈 自定義版本: ${CURRENT_VERSION} → ${NEW_VERSION}${NC}"
        ;;
    *)
        echo -e "${RED}❌ 錯誤: 無效的版本類型 '${VERSION_TYPE}'${NC}"
        echo "支援的類型: major, minor, patch, custom"
        echo "使用方法:"
        echo "  $0 patch          # 修補版本 (1.0.0 → 1.0.1)"
        echo "  $0 minor          # 次要版本 (1.0.0 → 1.1.0)"
        echo "  $0 major          # 主要版本 (1.0.0 → 2.0.0)"
        echo "  $0 custom 2.1.5   # 自定義版本"
        exit 1
        ;;
esac

# 驗證新版本號格式
if ! [[ $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${RED}❌ 錯誤: 無效的版本號格式 '${NEW_VERSION}'${NC}"
    echo "版本號必須符合格式: x.y.z (例如: 1.2.3)"
    exit 1
fi

echo -e "${GREEN}✅ 新版本號: ${CYAN}${NEW_VERSION}${NC}"
echo ""

# 檢查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  檢測到未提交的更改${NC}"
    echo "建議先提交所有更改再更新版本"
    echo ""
    echo "未提交的文件:"
    git status --porcelain
    echo ""
    echo "是否要繼續? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}ℹ️  操作已取消${NC}"
        exit 0
    fi
fi

# 檢查是否已經存在該版本的tag
if git tag -l | grep -q "^v${NEW_VERSION}$"; then
    echo -e "${RED}❌ 錯誤: tag v${NEW_VERSION} 已經存在${NC}"
    echo "現有的tags:"
    git tag -l | grep "^v" | tail -5
    echo ""
    echo "是否要刪除並重新創建? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        git tag -d "v${NEW_VERSION}" 2>/dev/null || true
        echo -e "${GREEN}✅ 已刪除本地tag v${NEW_VERSION}${NC}"
    else
        echo -e "${BLUE}ℹ️  操作已取消${NC}"
        exit 0
    fi
fi

# 更新package.json版本
echo -e "${BLUE}📝 更新package.json版本...${NC}"
npm version "$NEW_VERSION" --no-git-tag-version

# 驗證版本更新
UPDATED_VERSION=$(node -p "require('./package.json').version")
if [ "$UPDATED_VERSION" != "$NEW_VERSION" ]; then
    echo -e "${RED}❌ 錯誤: package.json版本更新失敗${NC}"
    exit 1
fi

echo -e "${GREEN}✅ package.json已更新: ${CYAN}${CURRENT_VERSION} → ${NEW_VERSION}${NC}"

# 創建提交
echo -e "${BLUE}📝 創建版本更新提交...${NC}"
git add package.json
git commit -m "chore: bump version to ${NEW_VERSION}

- 自動版本更新
- 版本類型: ${VERSION_TYPE}
- 更新時間: $(date '+%Y-%m-%d %H:%M:%S')"

# 創建tag
echo -e "${BLUE}🏷️  創建Git tag: v${NEW_VERSION}${NC}"
git tag -a "v${NEW_VERSION}" -m "Release version ${NEW_VERSION}

## 版本信息
- 版本號: ${NEW_VERSION}
- 更新類型: ${VERSION_TYPE}
- 發布時間: $(date '+%Y-%m-%d %H:%M:%S')

## 變更摘要
- 版本號從 ${CURRENT_VERSION} 更新至 ${NEW_VERSION}
- 準備發布新版本

## 自動化部署
此tag將觸發GitHub Actions自動構建和部署流程。"

echo -e "${GREEN}✅ Git tag已創建: v${NEW_VERSION}${NC}"

# 顯示下一步操作
echo ""
echo -e "${PURPLE}🎉 版本更新完成！${NC}"
echo ""
echo -e "${BLUE}📋 下一步操作:${NC}"
echo "1. 推送提交和tag到GitHub:"
echo -e "   ${YELLOW}git push origin main${NC}"
echo -e "   ${YELLOW}git push origin v${NEW_VERSION}${NC}"
echo ""
echo "2. 或者一次性推送所有內容:"
echo -e "   ${YELLOW}git push origin main --tags${NC}"
echo ""
echo "3. 查看GitHub Actions執行狀態:"
echo -e "   ${YELLOW}https://github.com/[您的用戶名]/[您的倉庫名]/actions${NC}"
echo ""

# 自動推送
echo -e "${YELLOW}🚀 自動推送提交到main分支...${NC}"
git push origin main

echo -e "${YELLOW}🚀 自動推送tag到GitHub...${NC}"
git push origin "v${NEW_VERSION}"

echo -e "${GREEN}✅ 所有更改已推送到GitHub！${NC}"
echo -e "${BLUE}🎉 GitHub Actions將自動開始執行構建和部署流程${NC}"
echo ""
echo -e "${CYAN}📊 版本更新摘要:${NC}"
echo -e "   舊版本: ${CURRENT_VERSION}"
echo -e "   新版本: ${NEW_VERSION}"
echo -e "   更新類型: ${VERSION_TYPE}"
echo -e "   Tag: v${NEW_VERSION}"
echo -e "   狀態: ✅ 已推送到GitHub"

echo ""
echo -e "${GREEN}🎉 腳本執行完成！${NC}"
