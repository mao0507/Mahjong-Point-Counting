<template>
  <div class="game-page min-h-full p-4 pb-20">
    <!-- 遊戲未開始：顯示玩家設定 -->
    <div v-if="!isGameActive" class="max-w-lg mx-auto">
      <PlayerSetup
        :default-player-names="savedPlayerNames"
        @start="handleStartGame"
      />
    </div>

    <!-- 遊戲進行中 -->
    <div v-else class="space-y-4">
      <!-- 標題與操作按鈕 -->
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold text-mahjong-green">麻將計分</h1>
        <div class="flex gap-2">
          <button
            @click="showConfirmEnd = true"
            class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold active:scale-95 transition-transform"
          >
            結束遊戲
          </button>
        </div>
      </div>

      <!-- 計分板 -->
      <ScoreBoard
        :players="currentPlayers"
        :current-round="gameState?.currentRoundNumber || 1"
        :total-rounds="currentRounds.length"
        :current-dealer="gameState?.currentDealer"
        :dealer-win-count="gameState?.dealerWinCount"
      />

      <!-- 計分輸入 -->
      <ScoreInput
        :players="currentPlayers"
        :base-point="currentSettings.basePoint"
        :base-multiplier="currentSettings.baseMultiplier"
        :enable-flower-tiles="currentSettings.enableFlowerTiles"
        :enable-honor-tiles="currentSettings.enableHonorTiles"
        :current-dealer="gameState?.currentDealer"
        :dealer-win-count="gameState?.dealerWinCount"
        @submit="handleAddRound"
      />

      <!-- 最近記錄 -->
      <div v-if="recentRounds.length > 0" class="mahjong-card">
        <h3 class="font-bold text-gray-700 mb-3">最近記錄</h3>
        <div class="space-y-2">
          <div
            v-for="round in recentRounds"
            :key="round.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
          >
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-gray-500">第{{ round.roundNumber }}局</span>
              <span v-if="round.winType === 'draw'" class="text-gray-600">
                流局
              </span>
              <template v-else>
                <span v-if="round.winType === 'self_draw'" class="font-bold text-mahjong-green">
                  {{ windNames[round.winnerPosition] }}
                </span>
                <span class="text-gray-600">
                  {{ round.winType === 'self_draw' 
                    ? '自摸' 
                    : `${getPlayerName(round.winnerPosition)} 胡 ${getPlayerName(round.loserPosition)}` 
                  }}
                </span>
                <span class="font-bold text-mahjong-gold">{{ round.tai }}台</span>
                <span class="font-bold text-blue-600">
                  {{ calculateRoundPoints(round, round.winType) }}元
                </span>
              </template>
            </div>
            <button
              @click="handleDeleteRound(round.id)"
              class="text-red-500 text-xs px-2 py-1 hover:bg-red-50 rounded"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 確認結束遊戲對話框 -->
    <ConfirmDialog
      v-if="showConfirmEnd"
      title="確認結束遊戲？"
      message="結束後將無法繼續記錄，但歷史記錄會保留。"
      confirm-text="確認結束"
      cancel-text="取消"
      @confirm="handleEndGame"
      @cancel="showConfirmEnd = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { WIND_NAMES } from '@/constants'
import PlayerSetup from '@/components/game/PlayerSetup.vue'
import ScoreBoard from '@/components/game/ScoreBoard.vue'
import ScoreInput from '@/components/game/ScoreInput.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import type { GameSettings, WindPosition, WinType, HandType } from '@/types'

const gameStore = useGameStore()

// 狀態
const showConfirmEnd = ref(false)
const savedPlayerNames = ref<string[]>(['', '', '', ''])

// 計算屬性
const isGameActive = computed(() => gameStore.isGameActive)
const gameState = computed(() => gameStore.gameState)
const currentPlayers = computed(() => gameStore.currentPlayers)
const currentRounds = computed(() => gameStore.currentRounds)
const currentSettings = computed(() => gameStore.currentSettings)
const windNames = WIND_NAMES

// 最近 5 筆記錄
const recentRounds = computed(() => {
  return [...currentRounds.value].reverse().slice(0, 5)
})

// 獲取玩家名稱
function getPlayerName(position?: WindPosition): string {
  if (!position) return ''
  const player = gameState.value?.players.find((p) => p.position === position)
  return player ? player.name : ''
}

// 計算每局的點數
function calculateRoundPoints(round: any, winType?: string): number {
  const basePoints = (round.baseMultiplier + round.tai) * round.basePoint
  // 自摸時顯示三家總計
  if (winType === 'self_draw') {
    return basePoints * 3
  }
  return basePoints
}

// 初始化
onMounted(() => {
  gameStore.loadGameState()
  
  // 如果有進行中的遊戲，載入玩家名稱
  if (gameState.value && isGameActive.value) {
    savedPlayerNames.value = gameState.value.players.map((p) => p.name)
  }
})

// 開始遊戲
function handleStartGame(playerNames: string[], settings: GameSettings) {
  gameStore.startNewGame(playerNames, settings)
  savedPlayerNames.value = playerNames
}

// 新增一局記錄
function handleAddRound(data: {
  dealerPosition?: WindPosition
  winnerPosition: WindPosition
  winType: WinType
  tai: number
  loserPosition?: WindPosition
  handType?: HandType
}) {
  gameStore.addRound(
    data.winnerPosition,
    data.winType,
    data.tai,
    data.loserPosition,
    data.handType
  )
}

// 刪除記錄
function handleDeleteRound(roundId: string) {
  if (confirm('確定要刪除這筆記錄嗎？刪除後該局之後的記錄也會被移除。')) {
    gameStore.deleteRound(roundId)
  }
}

// 結束遊戲
function handleEndGame() {
  gameStore.endGame()
  showConfirmEnd.value = false
}
</script>
