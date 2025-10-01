<template>
  <div class="player-setup mahjong-card">
    <h2 class="text-xl font-bold text-center mb-4 text-mahjong-green">
      設定玩家
    </h2>

    <!-- 玩家名稱輸入 -->
    <div class="space-y-3 mb-6">
      <div v-for="(position, index) in windOrder" :key="position" class="flex items-center gap-3">
        <div class="flex-shrink-0 w-12 h-12 bg-mahjong-green text-white rounded-lg flex items-center justify-center font-bold text-lg">
          {{ windNames[position] }}
        </div>
        <input
          v-model="playerNames[index]"
          type="text"
          :placeholder="`玩家 ${index + 1}`"
          class="mahjong-input flex-1"
          maxlength="10"
        />
      </div>
    </div>

    <!-- 遊戲設定 -->
    <div class="space-y-3 mb-6">
      <h3 class="font-bold text-gray-700">遊戲設定</h3>
      
      <div class="flex items-center justify-between">
        <label class="text-gray-700">底分（元）</label>
        <select v-model.number="settings.basePoint" class="px-4 py-2 border border-gray-300 rounded-lg">
          <option :value="1">1 元</option>
          <option :value="5">5 元</option>
          <option :value="10">10 元</option>
          <option :value="20">20 元</option>
          <option :value="50">50 元</option>
          <option :value="100">100 元</option>
        </select>
      </div>

      <div class="flex items-center justify-between">
        <label class="text-gray-700">底（台）</label>
        <select v-model.number="settings.baseMultiplier" class="px-4 py-2 border border-gray-300 rounded-lg">
          <option :value="0">0 底</option>
          <option :value="1">1 底</option>
          <option :value="2">2 底</option>
          <option :value="3">3 底</option>
          <option :value="4">4 底</option>
        </select>
      </div>

      <div class="flex items-center justify-between">
        <label class="text-gray-700">起始分數</label>
        <input
          v-model.number="settings.startingScore"
          type="number"
          class="w-32 px-4 py-2 border border-gray-300 rounded-lg text-right"
        />
      </div>
    </div>

    <!-- 開始按鈕 -->
    <button
      @click="handleStartGame"
      :disabled="!canStartGame"
      class="w-full mahjong-button disabled:opacity-50 disabled:cursor-not-allowed"
    >
      開始遊戲
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { WIND_NAMES, WIND_ORDER, DEFAULT_GAME_SETTINGS } from '@/constants'
import type { GameSettings } from '@/types'

interface Props {
  defaultPlayerNames?: string[]
  defaultSettings?: Partial<GameSettings>
}

interface Emits {
  (e: 'start', playerNames: string[], settings: GameSettings): void
}

const props = withDefaults(defineProps<Props>(), {
  defaultPlayerNames: () => ['', '', '', ''],
})

const emit = defineEmits<Emits>()

// 風位相關
const windNames = WIND_NAMES
const windOrder = WIND_ORDER

// 玩家名稱
const playerNames = ref<string[]>(props.defaultPlayerNames || ['', '', '', ''])

// 遊戲設定
const settings = ref<GameSettings>({
  ...DEFAULT_GAME_SETTINGS,
  ...props.defaultSettings,
})

// 是否可以開始遊戲
const canStartGame = computed(() => {
  return playerNames.value.some((name) => name.trim() !== '')
})

// 開始遊戲
function handleStartGame() {
  if (!canStartGame.value) return

  // 補齊未填寫的玩家名稱
  const finalNames = playerNames.value.map((name, index) => {
    return name.trim() || `玩家${index + 1}`
  })

  emit('start', finalNames, settings.value)
}
</script>

<style scoped>
.player-setup {
  max-width: 500px;
  margin: 0 auto;
}
</style>

