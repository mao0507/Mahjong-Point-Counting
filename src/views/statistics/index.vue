<template>
  <div class="statistics-page min-h-full p-4 pb-20">
    <h1 class="text-2xl font-bold text-center mb-4 text-mahjong-green">
      統計資訊
    </h1>

    <!-- 無遊戲進行中 -->
    <div v-if="!isGameActive" class="text-center text-gray-500 mt-10">
      <p class="text-4xl mb-3">📊</p>
      <p>目前沒有進行中的遊戲</p>
      <p class="text-sm mt-2">請先開始新遊戲</p>
    </div>

    <!-- 統計內容 -->
    <div v-else class="space-y-4">
      <!-- 總覽卡片 -->
      <div class="mahjong-card">
        <h2 class="font-bold text-gray-800 mb-3">遊戲總覽</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="stat-item">
            <div class="stat-label">總局數</div>
            <div class="stat-value">{{ totalRounds }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">遊戲時長</div>
            <div class="stat-value text-base">{{ gameDuration }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">最大台數</div>
            <div class="stat-value text-mahjong-gold">{{ maxTai }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">平均台數</div>
            <div class="stat-value text-blue-600">{{ averageTai.toFixed(1) }}</div>
          </div>
        </div>
      </div>

      <!-- 排名 -->
      <div class="mahjong-card">
        <h2 class="font-bold text-gray-800 mb-3">分數排名</h2>
        <div class="space-y-3">
          <div
            v-for="(stat, index) in sortedByScore"
            :key="stat.position"
            class="ranking-item"
            :class="{ 'winner': index === 0 }"
          >
            <div class="flex items-center gap-3">
              <div class="rank-badge" :class="`rank-${index + 1}`">
                {{ index + 1 }}
              </div>
              <div class="flex items-center gap-2">
                <span class="wind-badge">{{ windNames[stat.position] }}</span>
                <span class="font-bold text-gray-800">{{ stat.name }}</span>
              </div>
            </div>
            <div
              class="text-xl font-bold"
              :class="{
                'text-green-600': stat.finalScore > 0,
                'text-red-600': stat.finalScore < 0,
                'text-gray-600': stat.finalScore === 0,
              }"
            >
              {{ stat.finalScore > 0 ? '+' : '' }}{{ stat.finalScore.toLocaleString() }}
            </div>
          </div>
        </div>
      </div>

      <!-- 玩家詳細統計 -->
      <div
        v-for="stat in playerStatistics"
        :key="stat.position"
        class="mahjong-card"
      >
        <div class="flex items-center gap-2 mb-3">
          <span class="wind-badge">{{ windNames[stat.position] }}</span>
          <h3 class="font-bold text-gray-800">{{ stat.name }}</h3>
        </div>

        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="stat-detail-item">
            <span class="label">總胡牌次數</span>
            <span class="value text-green-600">{{ stat.totalWins }}</span>
          </div>
          <div class="stat-detail-item">
            <span class="label">胡牌率</span>
            <span class="value text-blue-600">{{ formatPercentage(stat.winRate) }}</span>
          </div>
          <div class="stat-detail-item">
            <span class="label">自摸次數</span>
            <span class="value">{{ stat.selfDrawWins }}</span>
          </div>
          <div class="stat-detail-item">
            <span class="label">放炮贏次數</span>
            <span class="value">{{ stat.discardWins }}</span>
          </div>
          <div class="stat-detail-item">
            <span class="label">放炮次數</span>
            <span class="value text-red-600">{{ stat.totalLoses }}</span>
          </div>
          <div class="stat-detail-item">
            <span class="label">平均贏分</span>
            <span class="value text-green-600">
              {{ stat.averageWinPoints > 0 ? stat.averageWinPoints.toFixed(0) : '-' }}
            </span>
          </div>
          <div class="stat-detail-item">
            <span class="label">最高單局得分</span>
            <span class="value text-mahjong-gold">
              {{ stat.maxWinPoints > 0 ? '+' + stat.maxWinPoints.toLocaleString() : '-' }}
            </span>
          </div>
          <div class="stat-detail-item">
            <span class="label">最終分數</span>
            <span
              class="value font-bold"
              :class="{
                'text-green-600': stat.finalScore > 0,
                'text-red-600': stat.finalScore < 0,
              }"
            >
              {{ stat.finalScore > 0 ? '+' : '' }}{{ stat.finalScore.toLocaleString() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { useStatistics } from '@/composables/useStatistics'
import { WIND_NAMES } from '@/constants'
import { formatPercentage } from '@/utils/format'

const gameStore = useGameStore()

// 初始化
onMounted(() => {
  gameStore.loadGameState()
})

// 計算屬性
const isGameActive = computed(() => gameStore.isGameActive)
const gameState = computed(() => gameStore.gameState)
const windNames = WIND_NAMES

// 使用統計 composable
const {
  playerStatistics,
  sortedByScore,
  totalRounds,
  maxTai,
  averageTai,
} = useStatistics(gameState.value)

// 遊戲時長
const gameDuration = computed(() => {
  if (!gameState.value) return '-'
  
  const duration = Date.now() - gameState.value.startTime
  const hours = Math.floor(duration / (1000 * 60 * 60))
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}小時${minutes}分`
  }
  return `${minutes}分鐘`
})
</script>

<style scoped>
.stat-item {
  @apply text-center;
}

.stat-label {
  @apply text-xs text-gray-500 mb-1;
}

.stat-value {
  @apply text-2xl font-bold text-gray-800;
}

.ranking-item {
  @apply flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all;
}

.ranking-item.winner {
  @apply bg-gradient-to-r from-yellow-50 to-orange-50 ring-2 ring-mahjong-gold;
}

.rank-badge {
  @apply w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white;
}

.rank-badge.rank-1 {
  @apply bg-gradient-to-br from-yellow-400 to-yellow-600;
}

.rank-badge.rank-2 {
  @apply bg-gradient-to-br from-gray-300 to-gray-500;
}

.rank-badge.rank-3 {
  @apply bg-gradient-to-br from-orange-400 to-orange-600;
}

.rank-badge.rank-4 {
  @apply bg-gray-400;
}

.wind-badge {
  @apply bg-mahjong-green text-white px-2 py-1 rounded text-sm font-bold;
}

.stat-detail-item {
  @apply flex justify-between items-center p-2 bg-gray-50 rounded;
}

.stat-detail-item .label {
  @apply text-gray-600;
}

.stat-detail-item .value {
  @apply font-bold text-gray-800;
}
</style>
