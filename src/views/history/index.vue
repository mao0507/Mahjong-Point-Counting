<template>
  <div class="history-page min-h-full p-4 pb-20">
    <h1 class="text-2xl font-bold text-center mb-4 text-mahjong-green">
      歷史記錄
    </h1>

    <!-- 無遊戲進行中 -->
    <div v-if="!isGameActive" class="text-center text-gray-500 mt-10">
      <p class="text-4xl mb-3">📋</p>
      <p>目前沒有進行中的遊戲</p>
      <p class="text-sm mt-2">請先開始新遊戲</p>
    </div>

    <!-- 有遊戲但沒有記錄 -->
    <div
      v-else-if="currentRounds.length === 0"
      class="text-center text-gray-500 mt-10"
    >
      <p class="text-4xl mb-3">🎮</p>
      <p>尚未有任何記錄</p>
      <p class="text-sm mt-2">開始記錄第一局吧！</p>
    </div>

    <!-- 記錄列表 -->
    <div v-else class="space-y-4">
      <!-- 遊戲資訊 -->
      <div class="mahjong-card">
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-bold text-gray-800">遊戲資訊</h2>
          <span class="text-sm text-gray-500">
            {{ formatDateTime(gameState?.startTime || 0) }}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="text-gray-600">
            總局數：<span class="font-bold text-gray-800">{{ currentRounds.length }}</span>
          </div>
          <div class="text-gray-600">
            底分：<span class="font-bold text-gray-800">{{ currentSettings.basePoint }} 元</span>
          </div>
          <div class="text-gray-600">
            底：<span class="font-bold text-gray-800">{{ currentSettings.baseMultiplier }} 底</span>
          </div>
        </div>
      </div>

      <!-- 記錄卡片 -->
      <div
        v-for="round in reversedRounds"
        :key="round.id"
        class="round-card mahjong-card"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="round-number">第 {{ round.roundNumber }} 局</span>
            <span class="text-xs text-gray-500">
              {{ formatTime(round.timestamp) }}
            </span>
          </div>
          <button
            @click="handleDeleteRound(round.id)"
            class="text-red-500 text-xs px-2 py-1 hover:bg-red-50 rounded transition-colors"
          >
            刪除
          </button>
        </div>

        <div class="mb-3">
          <div v-if="round.dealerPosition" class="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>莊家：{{ windNames[round.dealerPosition] }} {{ getPlayerName(round.dealerPosition) }}</span>
            <span v-if="round.isDealerWin" class="text-orange-600 font-bold">
              → 連莊<span v-if="round.dealerWinCount">({{ round.dealerWinCount }}連)</span>
            </span>
            <span v-else-if="round.nextDealer" class="text-blue-600">
              → {{ windNames[round.nextDealer] }} {{ getPlayerName(round.nextDealer) }}
            </span>
          </div>
          <div class="flex items-center gap-2 mb-2 flex-wrap">
            <span v-if="round.winType === 'draw'" class="win-type-badge draw">
              流局
            </span>
            <template v-else>
              <span v-if="round.winType === 'self_draw'" class="winner-badge">
                {{ getPlayerName(round.winnerPosition) }}
                <span v-if="round.dealerPosition === round.winnerPosition" class="text-xs">（莊）</span>
              </span>
              <span class="win-type-badge" :class="round.winType">
                {{ round.winType === 'self_draw' 
                  ? '自摸' 
                  : `${getPlayerName(round.winnerPosition)} 胡 ${getPlayerName(round.loserPosition!)}` 
                }}
              </span>
              <span class="tai-badge">{{ round.tai }} 台</span>
              <span v-if="round.handType" class="hand-type-badge">
                {{ handTypeNames[round.handType] }}
              </span>
            </template>
          </div>
          
        </div>

        <!-- 分數變動 -->
        <div class="mt-2 text-xs text-gray-500">
          計算：({{ round.baseMultiplier }}底 + {{ round.tai }}台) × {{ round.basePoint }}元/台
        </div>
        
        <!-- 分數變動 -->
        <div class="score-changes">
          <div
            v-for="change in round.scoreChanges"
            :key="change.position"
            class="score-change-item"
          >
            <span class="player-info">
              {{ windNames[change.position] }}
              {{ getPlayerName(change.position) }}
            </span>
            <span
              class="score-value"
              :class="{
                'positive': change.change > 0,
                'negative': change.change < 0,
              }"
            >
              {{ change.change > 0 ? '+' : '' }}{{ change.change.toLocaleString() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import { WIND_NAMES, HAND_TYPE_NAMES } from '@/constants'
import { formatDateTime, formatTime } from '@/utils/format'
import type { WindPosition } from '@/types'

const gameStore = useGameStore()

// 計算屬性
const isGameActive = computed(() => gameStore.isGameActive)
const gameState = computed(() => gameStore.gameState)
const currentRounds = computed(() => gameStore.currentRounds)
const currentSettings = computed(() => gameStore.currentSettings)
const windNames = WIND_NAMES
const handTypeNames = HAND_TYPE_NAMES

// 反轉記錄順序（最新在上）
const reversedRounds = computed(() => {
  return [...currentRounds.value].reverse()
})

// 獲取玩家名稱
function getPlayerName(position: WindPosition): string {
  const player = gameState.value?.players.find((p) => p.position === position)
  return player ? player.name : ''
}

// 刪除記錄
function handleDeleteRound(roundId: string) {
  if (confirm('確定要刪除這筆記錄嗎？刪除後該局之後的記錄也會被移除。')) {
    gameStore.deleteRound(roundId)
  }
}
</script>

<style scoped>
.round-number {
  @apply font-bold text-mahjong-green;
}

.winner-badge {
  @apply bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold;
}

.win-type-badge {
  @apply px-3 py-1 rounded-full text-xs font-bold;
}

.win-type-badge.self_draw {
  @apply bg-blue-100 text-blue-800;
}

.win-type-badge.discard {
  @apply bg-orange-100 text-orange-800;
}

.win-type-badge.draw {
  @apply bg-gray-100 text-gray-800;
}

.tai-badge {
  @apply bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold;
}

.score-changes {
  @apply bg-gray-50 rounded-lg p-3 space-y-1;
}

.score-change-item {
  @apply flex justify-between items-center text-sm;
}

.player-info {
  @apply text-gray-700;
}

.score-value {
  @apply font-bold;
}

.score-value.positive {
  @apply text-green-600;
}

.score-value.negative {
  @apply text-red-600;
}
</style>
