<template>
  <div class="score-board">
    <h2 class="text-xl font-bold text-center mb-4 text-mahjong-green">
      計分板
    </h2>

    <!-- 分數卡片 -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div
        v-for="player in players"
        :key="player.id"
        class="score-card mahjong-card"
        :class="{ 
          'highlight': highlightedPosition === player.position,
          'dealer-card': currentDealer === player.position
        }"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-mahjong-green text-white rounded flex items-center justify-center text-sm font-bold">
              {{ windNames[player.position] }}
            </div>
            <span class="font-bold text-gray-800 truncate">{{ player.name }}</span>
            <span v-if="currentDealer === player.position" class="text-xs bg-red-500 text-white px-2 py-0.5 rounded font-bold">
              莊<span v-if="dealerWinCount && dealerWinCount > 0">{{ dealerWinCount }}</span>
            </span>
          </div>
        </div>
        
        <div class="text-right">
          <div
            class="text-2xl font-bold"
            :class="{
              'text-green-600': player.totalScore > 0,
              'text-red-600': player.totalScore < 0,
              'text-gray-600': player.totalScore === 0,
            }"
          >
            {{ formatScore(player.totalScore) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 統計資訊 -->
    <div class="stats-info text-center text-sm text-gray-600">
      <p>第 {{ currentRound }} 局</p>
      <p v-if="totalRounds > 0">總共 {{ totalRounds }} 局</p>
      <p v-if="currentDealer && dealerWinCount !== undefined" class="mt-2">
        <span class="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold text-xs">
          <span>莊家：{{ windNames[currentDealer] }}</span>
          <span v-if="dealerWinCount > 0" class="text-red-600">{{ dealerWinCount }}連勝</span>
          <span v-else>新莊</span>
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { computed } from 'vue'
import { WIND_NAMES } from '@/constants'
import type { Player, WindPosition } from '@/types'

interface Props {
  players: Player[]
  currentRound: number
  totalRounds?: number
  highlightedPosition?: WindPosition
  currentDealer?: WindPosition
  dealerWinCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  totalRounds: 0,
})

// 確保 props 被使用（避免 TypeScript 警告）
void props

const windNames = WIND_NAMES

// 格式化分數
function formatScore(score: number): string {
  if (score > 0) {
    return `+${score.toLocaleString()}`
  }
  return score.toLocaleString()
}
</script>

<style scoped>
.score-card {
  transition: all 0.3s ease;
}

.score-card.highlight {
  @apply ring-2 ring-mahjong-gold bg-yellow-50;
  transform: scale(1.02);
}

.score-card.dealer-card {
  @apply border-4 border-yellow-400;
  box-shadow: 0 0 0 1px rgba(234, 179, 8, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>

