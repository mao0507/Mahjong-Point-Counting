<template>
  <div class="settings-page min-h-full p-4 pb-20">
    <h1 class="text-2xl font-bold text-center mb-4 text-mahjong-green">
      設定
    </h1>

    <div class="max-w-lg mx-auto space-y-4">
      <!-- 遊戲狀態 -->
      <div class="mahjong-card">
        <h2 class="font-bold text-gray-800 mb-3">遊戲狀態</h2>
        <div v-if="isGameActive" class="space-y-3">
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-600">遊戲狀態</span>
            <span class="text-green-600 font-bold">進行中</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-600">開始時間</span>
            <span class="text-gray-800">{{ formatDateTime(gameState?.startTime || 0) }}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-600">目前局數</span>
            <span class="text-gray-800 font-bold">{{ currentRounds.length }} 局</span>
          </div>
          
          <button
            @click="showConfirmClear = true"
            class="w-full bg-red-500 text-white font-bold py-3 px-6 rounded-lg active:scale-95 transition-transform"
          >
            清除目前遊戲
          </button>
        </div>
        <div v-else class="text-center text-gray-500 py-4">
          目前沒有進行中的遊戲
        </div>
      </div>

      <!-- 關於 -->
      <div class="mahjong-card">
        <h2 class="font-bold text-gray-800 mb-3">關於</h2>
        <div class="space-y-2 text-sm text-gray-600">
          <p>
            <span class="font-bold text-gray-800">麻將計分工具</span>
          </p>
          <p>版本：1.0.0</p>
          <p>使用 Vue 3 + TypeScript + Tailwind CSS 開發</p>
          <p class="pt-2 border-t border-gray-200">
            專為手機使用設計，快速記錄麻將遊戲分數
          </p>
        </div>
      </div>

      <!-- 使用說明 -->
      <div class="mahjong-card">
        <h2 class="font-bold text-gray-800 mb-3">使用說明</h2>
        <div class="space-y-3 text-sm text-gray-600">
          <div>
            <h3 class="font-bold text-gray-800 mb-1">1. 開始遊戲</h3>
            <p>在「遊戲」頁面輸入 4 位玩家姓名和底分設定，點擊「開始遊戲」</p>
          </div>
          <div>
            <h3 class="font-bold text-gray-800 mb-1">2. 記錄每局</h3>
            <p>選擇胡牌者、胡牌方式（自摸/放炮）、台數，系統會自動計算分數</p>
          </div>
          <div>
            <h3 class="font-bold text-gray-800 mb-1">3. 查看記錄</h3>
            <p>在「記錄」頁面可查看每局詳細記錄，也可刪除錯誤記錄</p>
          </div>
          <div>
            <h3 class="font-bold text-gray-800 mb-1">4. 統計資訊</h3>
            <p>在「統計」頁面可查看各玩家的勝率、平均得分等數據</p>
          </div>
        </div>
      </div>

      <!-- 計分規則 -->
      <div class="mahjong-card">
        <h2 class="font-bold text-gray-800 mb-3">計分規則</h2>
        <div class="space-y-2 text-sm text-gray-600">
          <div>
            <span class="font-bold text-gray-800">計算公式：</span>
            (底 + 台) × 底分
          </div>
          <div>
            <span class="font-bold text-gray-800">自摸：</span>
            其他三家各付 (底 + 台) × 底分
          </div>
          <div>
            <span class="font-bold text-gray-800">放炮：</span>
            放炮者支付全額 [(底 + 台) × 底分] × 3
          </div>
          <div class="pt-2 border-t border-gray-200">
            <span class="font-bold text-gray-800">範例：</span>
            2 底、底分 10 元，胡 3 台
            <ul class="list-disc list-inside mt-1 ml-2">
              <li>自摸：胡牌者得 150 元 [(2+3)×10×3]，其他各失 50 元</li>
              <li>放炮：胡牌者得 150 元，放炮者失 150 元</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 確認清除對話框 -->
    <ConfirmDialog
      v-if="showConfirmClear"
      title="確認清除遊戲？"
      message="清除後將無法恢復，所有記錄都會被刪除。"
      confirm-text="確認清除"
      cancel-text="取消"
      @confirm="handleClearGame"
      @cancel="showConfirmClear = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { formatDateTime } from '@/utils/format'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const gameStore = useGameStore()

// 狀態
const showConfirmClear = ref(false)

// 初始化
onMounted(() => {
  gameStore.loadGameState()
})

// 計算屬性
const isGameActive = computed(() => gameStore.isGameActive)
const gameState = computed(() => gameStore.gameState)
const currentRounds = computed(() => gameStore.currentRounds)

// 清除遊戲
function handleClearGame() {
  gameStore.clearGameState()
  showConfirmClear.value = false
}
</script>
