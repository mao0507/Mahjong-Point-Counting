<template>
  <div class="score-input mahjong-card">
    <h2 class="text-xl font-bold text-center mb-4 text-mahjong-green">
      記錄本局
    </h2>

    <!-- 步驟 1: 選擇胡牌者 -->
    <div class="mb-6">
      <h3 class="font-bold text-gray-700 mb-3">1. 誰胡牌？</h3>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="player in players"
          :key="player.id"
          @click="selectWinner(player.position)"
          class="player-button"
          :class="{ active: winnerPosition === player.position }"
        >
          <div class="text-lg font-bold">{{ windNames[player.position] }}</div>
          <div class="text-xs truncate">{{ player.name }}</div>
        </button>
      </div>
    </div>

    <!-- 步驟 2: 選擇胡牌類型 -->
    <div v-if="winnerPosition" class="mb-6">
      <h3 class="font-bold text-gray-700 mb-3">2. 胡牌方式</h3>
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="selectWinType('self_draw')"
          class="win-type-button"
          :class="{ active: winType === 'self_draw' }"
        >
          <span class="text-2xl mb-1">🎯</span>
          <span class="font-bold">自摸</span>
        </button>
        <button
          @click="selectWinType('discard')"
          class="win-type-button"
          :class="{ active: winType === 'discard' }"
        >
          <span class="text-2xl mb-1">💥</span>
          <span class="font-bold">放炮</span>
        </button>
      </div>
    </div>

    <!-- 步驟 3: 選擇放炮者（如果是放炮） -->
    <div v-if="winType === 'discard'" class="mb-6">
      <h3 class="font-bold text-gray-700 mb-3">3. 誰放炮？</h3>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="player in losablePlayers"
          :key="player.id"
          @click="selectLoser(player.position)"
          class="player-button"
          :class="{ active: loserPosition === player.position }"
        >
          <div class="text-lg font-bold">{{ windNames[player.position] }}</div>
          <div class="text-xs truncate">{{ player.name }}</div>
        </button>
      </div>
    </div>

    <!-- 步驟 4: 輸入台數 -->
    <div v-if="winType" class="mb-6">
      <h3 class="font-bold text-gray-700 mb-3">
        {{ winType === 'discard' ? '4' : '3' }}. 幾台？
      </h3>
      
      <!-- 常用台數快選 -->
      <div class="grid grid-cols-5 gap-2 mb-3">
        <button
          v-for="option in commonTaiOptions"
          :key="option"
          @click="tai = option"
          class="tai-button"
          :class="{ active: tai === option }"
        >
          {{ option }}
        </button>
      </div>

      <!-- 自訂台數 -->
      <div class="flex items-center gap-2">
        <label class="text-gray-700 whitespace-nowrap">自訂：</label>
        <input
          v-model.number="tai"
          type="number"
          min="1"
          max="9999"
          class="mahjong-input flex-1 text-center text-xl font-bold"
          placeholder="輸入台數"
        />
      </div>
    </div>

    <!-- 預覽分數變動 -->
    <div v-if="canPreview" class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="font-bold text-gray-700 mb-2">分數變動預覽</h3>
      <div class="space-y-1">
        <div
          v-for="change in previewScoreChanges"
          :key="change.position"
          class="flex justify-between items-center"
        >
          <span class="text-sm">
            {{ windNames[change.position] }}
            {{ getPlayerName(change.position) }}
          </span>
          <span
            class="font-bold"
            :class="{
              'text-green-600': change.change > 0,
              'text-red-600': change.change < 0,
            }"
          >
            {{ change.change > 0 ? '+' : '' }}{{ change.change.toLocaleString() }}
          </span>
        </div>
      </div>
      <div class="mt-2 text-xs text-gray-500 text-center">
        ({{ baseMultiplier }}底 + {{ tai }}台) × {{ basePoint }}元 = {{ (baseMultiplier + tai) * basePoint }} 元
      </div>
    </div>

    <!-- 操作按鈕 -->
    <div class="flex gap-3">
      <button
        @click="handleReset"
        class="flex-1 mahjong-button-secondary"
      >
        重置
      </button>
      <button
        @click="handleSubmit"
        :disabled="!canSubmit"
        class="flex-1 mahjong-button disabled:opacity-50 disabled:cursor-not-allowed"
      >
        確認記錄
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { WIND_NAMES, COMMON_TAI_OPTIONS } from '@/constants'
import { calculateScoreChanges } from '@/utils/calculator'
import type { Player, WindPosition, WinType, ScoreChange } from '@/types'

interface Props {
  players: Player[]
  basePoint: number
  baseMultiplier: number
}

interface Emits {
  (
    e: 'submit',
    data: {
      winnerPosition: WindPosition
      winType: WinType
      tai: number
      loserPosition?: WindPosition
    }
  ): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const windNames = WIND_NAMES
const commonTaiOptions = COMMON_TAI_OPTIONS

// 表單資料
const winnerPosition = ref<WindPosition>()
const winType = ref<WinType>()
const loserPosition = ref<WindPosition>()
const tai = ref<number>()

// 可以被選為放炮者的玩家（排除胡牌者）
const losablePlayers = computed(() => {
  return props.players.filter((p) => p.position !== winnerPosition.value)
})

// 是否可以預覽
const canPreview = computed(() => {
  if (!winnerPosition.value || !winType.value || !tai.value) return false
  if (winType.value === 'discard' && !loserPosition.value) return false
  return true
})

// 是否可以提交
const canSubmit = computed(() => {
  return canPreview.value && tai.value && tai.value > 0
})

// 預覽分數變動
const previewScoreChanges = computed<ScoreChange[]>(() => {
  if (!canPreview.value) return []

  return calculateScoreChanges(
    winnerPosition.value!,
    winType.value!,
    loserPosition.value,
    tai.value!,
    props.basePoint,
    props.baseMultiplier
  )
})

// 選擇胡牌者
function selectWinner(position: WindPosition) {
  winnerPosition.value = position
  // 如果之前選的放炮者是現在的胡牌者，清除放炮者選擇
  if (loserPosition.value === position) {
    loserPosition.value = undefined
  }
}

// 選擇胡牌類型
function selectWinType(type: WinType) {
  winType.value = type
  // 如果選擇自摸，清除放炮者
  if (type === 'self_draw') {
    loserPosition.value = undefined
  }
}

// 選擇放炮者
function selectLoser(position: WindPosition) {
  loserPosition.value = position
}

// 獲取玩家名稱
function getPlayerName(position: WindPosition): string {
  const player = props.players.find((p) => p.position === position)
  return player ? player.name : ''
}

// 重置表單
function handleReset() {
  winnerPosition.value = undefined
  winType.value = undefined
  loserPosition.value = undefined
  tai.value = undefined
}

// 提交表單
function handleSubmit() {
  if (!canSubmit.value) return

  emit('submit', {
    winnerPosition: winnerPosition.value!,
    winType: winType.value!,
    tai: tai.value!,
    loserPosition: loserPosition.value,
  })

  // 提交後重置表單
  handleReset()
}
</script>

<style scoped>
.player-button {
  @apply bg-white border-2 border-gray-300 rounded-lg py-3 px-2 transition-all active:scale-95;
}

.player-button.active {
  @apply border-mahjong-green bg-green-50 ring-2 ring-mahjong-green;
}

.win-type-button {
  @apply bg-white border-2 border-gray-300 rounded-lg py-4 flex flex-col items-center transition-all active:scale-95;
}

.win-type-button.active {
  @apply border-mahjong-green bg-green-50 ring-2 ring-mahjong-green;
}

.tai-button {
  @apply bg-white border-2 border-gray-300 rounded-lg py-3 font-bold transition-all active:scale-95;
}

.tai-button.active {
  @apply border-mahjong-gold bg-yellow-50 ring-2 ring-mahjong-gold text-mahjong-gold;
}
</style>

