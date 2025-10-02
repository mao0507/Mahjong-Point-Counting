#!/bin/bash

# 測試GitHub Actions觸發條件的腳本
# 此腳本用於驗證觸發配置是否正確

set -e

# 顏色定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔍 GitHub Actions觸發條件測試${NC}"
echo ""

# 檢查工作流程文件
WORKFLOW_FILES=(
    ".github/workflows/release.yml"
)

echo -e "${YELLOW}📋 檢查工作流程觸發配置...${NC}"
echo ""

for workflow in "${WORKFLOW_FILES[@]}"; do
    if [ -f "$workflow" ]; then
        echo -e "${BLUE}檢查: ${workflow}${NC}"
        
        # 檢查是否只配置了tags觸發
        if grep -q "tags:" "$workflow" && ! grep -q "branches:" "$workflow"; then
            echo -e "${GREEN}✅ 正確配置：只響應tag推送${NC}"
        elif grep -q "branches:" "$workflow"; then
            echo -e "${RED}❌ 警告：同時配置了branches觸發${NC}"
        else
            echo -e "${YELLOW}⚠️  未找到觸發配置${NC}"
        fi
        
        # 顯示觸發配置
        echo "觸發配置："
        sed -n '/^on:/,/^jobs:/p' "$workflow" | grep -E "(tags|branches)" || echo "  無觸發配置"
        echo ""
    else
        echo -e "${YELLOW}⚠️  文件不存在: ${workflow}${NC}"
        echo ""
    fi
done

echo -e "${YELLOW}📊 觸發條件總結：${NC}"
echo ""
echo -e "${GREEN}✅ 會觸發GitHub Actions的操作：${NC}"
echo "  - git tag v1.0.0 && git push origin v1.0.0"
echo "  - git tag v2.1.3 && git push origin v2.1.3"
echo "  - git tag v1.0.0-beta && git push origin v1.0.0-beta"
echo ""
echo -e "${RED}❌ 不會觸發GitHub Actions的操作：${NC}"
echo "  - git push origin main"
echo "  - git push origin develop"
echo "  - git push origin feature/new-feature"
echo "  - 普通的git commit和push"
echo ""

echo -e "${BLUE}🎯 測試建議：${NC}"
echo "1. 創建一個測試tag:"
echo "   git tag v1.0.0-test"
echo "   git push origin v1.0.0-test"
echo ""
echo "2. 檢查GitHub Actions頁面是否觸發"
echo ""
echo "3. 測試完成後刪除測試tag:"
echo "   git tag -d v1.0.0-test"
echo "   git push origin :refs/tags/v1.0.0-test"
echo ""

echo -e "${GREEN}🎉 觸發條件測試完成！${NC}"
