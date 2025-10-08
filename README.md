# 麻將計分工具 🀄

使用 Vue 3 + TypeScript + Tailwind CSS 開發的麻將計分網頁工具，專為手機使用優化。

## 功能特色

- 🎮 快速記錄每局麻將分數
- 📊 即時計算玩家總分
- 📝 完整歷史記錄與統計分析
- 💾 本地儲存，資料不遺失
- 📱 手機優先設計，觸控友善
- 🎨 美觀現代化介面
- 🏆 支援連莊機制
- ⚙️ 靈活的遊戲設定（見花、見字、嚦咕嚦咕）
- 🎯 **多選牌型功能**：支援同時選擇多個牌型
- 🧮 **精確台數計算**：莊家與閒家台數分離顯示
- 💰 **詳細分數預覽**：清楚顯示各玩家支付金額
- 🚀 自動化版本管理和部署
- 🔧 完整的開發工具鏈

## 技術架構

- **Vue 3** - 使用 Composition API
- **TypeScript** - 完整的型別支援
- **Tailwind CSS** - 快速打造美觀介面
- **Vite** - 快速的開發體驗
- **Pinia** - 狀態管理
- **Vue Router** - 路由管理

## 開發工具

### 自動化腳本
- **版本管理**：自動版本號更新和Git tag創建
- **GitHub Actions**：自動構建和部署
- **GitHub Pages**：自動部署到靜態網站
- **測試工具**：觸發條件和發布流程測試

### 程式碼品質
- **TypeScript**：完整的型別檢查
- **ESLint**：程式碼風格檢查
- **Prettier**：程式碼格式化
- **JSDoc**：完整的函數文檔

## 開始使用

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

### 編譯打包

```bash
npm run build
```

### 預覽打包結果

```bash
npm run preview
```

### 類型檢查

```bash
npm run type-check
```

## 🚀 自動化部署

本專案配置了GitHub Actions，支援自動化構建和部署：

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

### 自動化流程
1. ✅ 自動安裝依賴
2. ✅ 執行類型檢查
3. ✅ 構建項目
4. ✅ 推送到 `release` 分支
5. ✅ 部署到GitHub Pages
6. ✅ 創建GitHub Release

### 訪問網站
部署完成後，可在以下網址訪問：
- **GitHub Pages**：`https://您的GitHub用戶名.github.io/Mahjong-Point-Counting/`
- **Release分支**：`https://github.com/您的GitHub用戶名/Mahjong-Point-Counting/tree/release`

### 測試部署流程
使用提供的測試腳本：

```bash
# 測試版本發布流程
./scripts/test-release.sh v1.0.0-test

# 測試觸發條件
./scripts/test-triggers.sh

# 或指定版本
./scripts/test-release.sh v2.0.0
```

### 版本管理
使用自動化版本管理腳本：

```bash
# 使用npm腳本（推薦）
npm run version:patch    # 修補版本 (1.0.7 → 1.0.8)
npm run version:minor    # 次要版本 (1.0.7 → 1.1.0)
npm run version:major    # 主要版本 (1.0.7 → 2.0.0)
npm run version:custom   # 自定義版本（需提供版本號）

# 快速發布
npm run release:patch    # 快速修補版本發布
npm run release:minor    # 快速次要版本發布
npm run release:major    # 快速主要版本發布

# 測試發布流程
npm run test:release     # 測試發布流程

# 或直接使用腳本
./scripts/version-manager.sh patch
node scripts/version-manager.js minor
```

### 可用腳本
專案提供多個實用腳本：

```bash
# 版本管理腳本
./scripts/version-manager.sh patch    # 完整版版本管理
node scripts/version-manager.js minor # Node.js版本（跨平台）
./scripts/quick-release.sh patch      # 快速發布

# 測試腳本
./scripts/test-release.sh v1.0.0-test # 測試發布流程
./scripts/test-triggers.sh             # 測試觸發條件
```

詳細說明請參考：
- [.github/README.md](.github/README.md) - GitHub Actions說明
- [scripts/README.md](scripts/README.md) - 版本管理腳本說明

### 工作流程狀態
專案已優化為只保留一個主要工作流程：
- **`.github/workflows/release.yml`**: 主要發布工作流程
- 其他版本已備份為 `.backup` 文件
- 支援完整的自動化構建和部署流程

## 專案結構

```
src/
├── assets/          # 靜態資源
├── styles/          # 全域樣式
├── components/      # 共用元件
│   ├── common/      # 通用組件
│   └── game/        # 遊戲相關組件
├── router/          # 路由設定
├── composables/     # 可複用邏輯
├── constants/       # 常數定義
├── stores/          # 狀態管理
├── types/           # TypeScript 類型定義
├── utils/           # 工具函數
├── views/           # 頁面元件
│   ├── game/        # 遊戲主頁
│   ├── history/     # 歷史記錄
│   ├── statistics/  # 統計分析
│   └── settings/    # 遊戲設定
├── App.vue
└── main.ts
```

## 麻將計分規則

### 基本規則
- 支援台灣麻將計分規則
- **計算公式**：(底 + 台) × 底分
- **自摸**：
  - 莊家自摸：其他三家各付相同金額（包含莊家台）
  - 閒家自摸：莊家付較多（包含莊家台），其他閒家付較少（不含莊家台）
- **放炮**：放炮者支付 (底 + 台) × 底分，胡牌者得分
- **多選牌型**：支援同時選擇多個牌型，台數累加計算
- 可自訂底分、底數設定

### 連莊機制
- 莊家胡牌時連莊，連莊次數累積
- 莊家台數 = 2 × 連莊次數 + 1
- 破莊時連莊次數歸零

### 牌型台數（按台數分組）

#### 0台
- 屁胡

#### 1台
- 門清、單吊、邊張、中洞
- 槓上開花、搶槓
- 紅中、青發、白板（需啟用見字）
- 東風、南風、西風、北風（需啟用見字）
- 正花（需啟用見花）
- 海底撈月

#### 2台
- 平胡、碰碰胡、三暗刻
- **全求人**

#### 4台
- 混一色、四暗刻
- 小三元（需啟用見字）

#### 8台
- 五暗刻、大三元（需啟用見字）
- 小四喜（需啟用見字）
- 八仙過海（需啟用見花）
- 清一色、嚦咕嚦咕
- **migi**

#### 16台
- 大四喜（需啟用見字）
- 地胡、字一色（需啟用見字）

#### 24台
- 天胡

### 計分範例
設定：2 底、底分 10 元

#### 莊家自摸 3 台（連莊2次）
- 總台數：4台（牌型3台+自摸1台）+ 5台（莊家台）= 9台
- 每家應付：(2+9) × 10 = 110 元
- 胡牌者得：110 × 3 = 330 元

#### 閒家自摸 3 台（莊家連莊2次）
- 莊家台數：6台（牌型3台+自摸1台+莊家台5台）
- 閒家台數：4台（牌型3台+自摸1台）
- 莊家應付：(2+6) × 10 = 80 元
- 閒家各付：(2+4) × 10 = 60 元
- 胡牌者得：80 + 60 + 60 = 200 元

#### 放炮 3 台
- 放炮者失：(2+3) × 10 = 50 元
- 胡牌者得：50 元

#### 多選牌型範例
- 門清(1台) + 平胡(2台) + 碰碰胡(2台) = 5台
- 計算：(2+5) × 10 = 70 元

## 遊戲設定

### 可調整選項
- **底分**：每台的分數（預設：10 元）
- **底數**：基礎台數（預設：2 底）
- **起始分數**：遊戲開始時的分數（預設：0）
- **連莊**：是否啟用莊家連莊機制
- **見花**：是否啟用花牌加台
- **見字**：是否啟用字牌（三元牌、風牌）加台
- **嚦咕嚦咕**：是否啟用嚦咕嚦咕規則

## 功能頁面

### 遊戲主頁
- 玩家設定（姓名、風位）
- 計分板顯示
- 快速記錄每局結果
- **多選牌型**：支援同時選擇多個牌型
- **精確台數計算**：莊家與閒家台數分離顯示
- **詳細分數預覽**：清楚顯示各玩家支付金額

### 歷史記錄
- 查看所有局數記錄
- 每局詳細資訊（胡牌者、多選牌型、台數、分數變動）
- 多選牌型以「+」符號連接顯示（如：門清+平胡）
- 刪除記錄功能

### 統計分析
- 各玩家勝率統計
- 平均得分分析
- 最高單局得分記錄

### 遊戲設定
- 自訂遊戲參數
- 啟用/停用特殊規則
- 設定持久化儲存

## 授權

MIT License

---

**版本**：1.0.8  
**更新日期**：2025年1月