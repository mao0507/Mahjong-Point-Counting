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
        :class="{ 'highlight': highlightedPosition === player.position }"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-mahjong-green text-white rounded flex items-center justify-center text-sm font-bold">
              {{ windNames[player.position] }}
            </div>
            <span class="font-bold text-gray-800 truncate">{{ player.name }}</span>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { WIND_NAMES } from '@/constants'
import type { Player, WindPosition } from '@/types'

interface Props {
  players: Player[]
  currentRound: number
  totalRounds?: number
  highlightedPosition?: WindPosition
}

const props = withDefaults(defineProps<Props>(), {
  totalRounds: 0,
})

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
</style>

