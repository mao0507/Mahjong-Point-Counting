# 麻將計分工具 🀄

使用 Vue 3 + TypeScript + Tailwind CSS 開發的麻將計分網頁工具，專為手機使用優化。

## 功能特色

- 🎮 快速記錄每局麻將分數
- 📊 即時計算玩家總分
- 📝 完整歷史記錄
- 💾 本地儲存，資料不遺失
- 📱 手機優先設計，觸控友善
- 🎨 美觀現代化介面

## 技術架構

- **Vue 3** - 使用 Composition API
- **TypeScript** - 完整的型別支援
- **Tailwind CSS** - 快速打造美觀介面
- **Vite** - 快速的開發體驗
- **Pinia** - 狀態管理
- **Vue Router** - 路由管理

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

## 專案結構

```
src/
├── assets/          # 靜態資源
├── styles/          # 全域樣式
├── components/      # 共用元件
├── router/          # 路由設定
├── composables/     # 可複用邏輯
├── config/          # 配置文件
├── constants/       # 常數定義
├── locales/         # 多語言
├── services/        # API 服務
├── stores/          # 狀態管理
├── types/           # TypeScript 類型定義
├── utils/           # 工具函數
├── views/           # 頁面元件
├── App.vue
└── main.ts
```

## 麻將計分規則

- 支援台灣麻將計分規則
- **計算公式**：(底 + 台) × 底分
- **自摸**：其他三家各付 (底 + 台) × 底分
- **放炮**：放炮者支付全額 [(底 + 台) × 底分] × 3
- 可自訂底分、底數設定

### 計分範例
設定：2 底、底分 10 元
- 胡 3 台自摸：(2+3) × 10 = 50 元/家，胡牌者得 150 元
- 胡 3 台放炮：(2+3) × 10 × 3 = 150 元，放炮者失 150 元

## 授權

MIT License

