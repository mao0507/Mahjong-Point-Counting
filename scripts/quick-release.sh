#!/bin/bash

# 快速版本發布腳本
# 使用方法: ./scripts/quick-release.sh [patch|minor|major] [message]

set -e

# 顏色定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

VERSION_TYPE=${1:-"patch"}
RELEASE_MESSAGE=${2:-"Release"}

# 獲取當前版本
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}當前版本: ${CURRENT_VERSION}${NC}"

# 更新版本號
NEW_VERSION=$(npm version "$VERSION_TYPE" --no-git-tag-version)
echo -e "${GREEN}新版本: ${NEW_VERSION}${NC}"

# 創建提交
git add package.json
git commit -m "chore: bump version to ${NEW_VERSION}"

# 創建tag
git tag -a "v${NEW_VERSION}" -m "${RELEASE_MESSAGE} ${NEW_VERSION}"

echo -e "${YELLOW}Tag已創建: v${NEW_VERSION}${NC}"

# 自動推送
echo -e "${BLUE}🚀 自動推送提交...${NC}"
git push origin main

echo -e "${BLUE}🚀 自動推送tag...${NC}"
git push origin "v${NEW_VERSION}"

echo -e "${GREEN}✅ 發布完成！GitHub Actions將自動執行構建流程${NC}"
