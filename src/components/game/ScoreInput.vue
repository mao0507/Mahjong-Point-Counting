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
          :class="{ 
            active: winnerPosition === player.position,
            'dealer-button': dealerPosition === player.position
          }"
        >
          <div class="text-lg font-bold">
            {{ windNames[player.position] }}
            <span v-if="player.position === dealerPosition" class="text-red-600">莊</span>
          </div>
          <div class="text-xs truncate">{{ player.name }}</div>
        </button>
      </div>
    </div>

    <!-- 步驟 2: 選擇胡牌類型 -->
    <div v-if="winnerPosition" class="mb-6">
      <h3 class="font-bold text-gray-700 mb-3">2. 胡牌方式</h3>
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="selectWinType(WinType.SELF_DRAW)"
          class="win-type-button"
          :class="{ active: winType === WinType.SELF_DRAW }"
        >
          <span class="text-2xl mb-1">🎯</span>
          <span class="font-bold">自摸</span>
        </button>
        <button
          @click="selectWinType(WinType.DISCARD)"
          class="win-type-button"
          :class="{ active: winType === WinType.DISCARD }"
        >
          <span class="text-2xl mb-1">💥</span>
          <span class="font-bold">放槍</span>
        </button>
      </div>
      
      <!-- 莊台顯示（莊家胡牌或被胡時顯示） -->
      <div v-if="winType && (isDealerWinner || isDealerLoser)" class="mt-4 bg-orange-50 p-3 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="text-gray-700 font-medium">
            {{ isDealerWinner ? '莊家台數' : '胡莊家台數' }}
          </span>
          <span class="text-orange-600 font-bold">
            +{{ dealerExtraTai }} 台
          </span>
        </div>
        <div class="mt-1 text-xs text-gray-600 text-center">
          {{ isDealerWinner ? '連莊' : '破莊' }}{{ currentDealerWinCount }}次：2×{{ currentDealerWinCount }} + 1 = {{ dealerExtraTai }}台
        </div>
      </div>
    </div>

    <!-- 步驟 3: 選擇放槍者 -->
    <div v-if="winType === WinType.DISCARD" class="mb-6">
      <h3 class="font-bold text-gray-700 mb-3">3. 誰放槍？</h3>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="player in losablePlayers"
          :key="player.id"
          @click="selectLoser(player.position)"
          class="player-button"
          :class="{ 
            active: loserPosition === player.position,
            'dealer-button': dealerPosition === player.position
          }"
        >
          <div class="text-lg font-bold">
            {{ windNames[player.position] }}
            <span v-if="player.position === dealerPosition" class="text-red-600">莊</span>
          </div>
          <div class="text-xs truncate">{{ player.name }}</div>
        </button>
      </div>
    </div>

    <!-- 步驟 4: 選擇牌型（可選） -->
    <div v-if="winType" class="mb-6">
      <h3 class="font-bold text-gray-700 mb-3">
        {{ winType === WinType.DISCARD ? '4' : '3' }}. 牌型（可選）
      </h3>
      
      <!-- 0台 -->
      <div v-if="commonHandTypes.tai0.length > 0" class="mb-3">
        <div class="text-xs text-gray-500 mb-2">0台</div>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="type in commonHandTypes.tai0"
            :key="type"
            @click="selectHandType(type)"
            class="hand-type-button"
            :class="{ active: handTypes.includes(type) }"
          >
            {{ handTypeNames[type] }}
          </button>
        </div>
      </div>

      <!-- 1台 -->
      <div class="mb-3">
        <div class="text-xs text-gray-500 mb-2">1台</div>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="type in getFilteredTai1Types()"
            :key="type"
            @click="selectHandType(type)"
            class="hand-type-button"
            :class="{ active: handTypes.includes(type) }"
          >
            {{ handTypeNames[type] }}
          </button>
        </div>
      </div>

      <!-- 2台 -->
      <div class="mb-3">
        <div class="text-xs text-gray-500 mb-2">2台</div>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="type in getFilteredTai2Types()"
            :key="type"
            @click="selectHandType(type)"
            class="hand-type-button"
            :class="{ active: handTypes.includes(type) }"
          >
            {{ handTypeNames[type] }}
          </button>
        </div>
      </div>

      <!-- 4台 -->
      <div class="mb-3">
        <div class="text-xs text-gray-500 mb-2">4台</div>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="type in getFilteredTai4Types()"
            :key="type"
            @click="selectHandType(type)"
            class="hand-type-button"
            :class="{ active: handTypes.includes(type) }"
          >
            {{ handTypeNames[type] }}
          </button>
        </div>
      </div>

      <!-- 8台 -->
      <div class="mb-3">
        <div class="text-xs text-gray-500 mb-2">8台</div>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="type in getFilteredTai8Types()"
            :key="type"
            @click="selectHandType(type)"
            class="hand-type-button"
            :class="{ active: handTypes.includes(type) }"
          >
            {{ handTypeNames[type] }}
          </button>
        </div>
      </div>

      <!-- 16台 -->
      <div class="mb-3">
        <div class="text-xs text-gray-500 mb-2">16台</div>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="type in getFilteredTai16Types()"
            :key="type"
            @click="selectHandType(type)"
            class="hand-type-button"
            :class="{ active: handTypes.includes(type) }"
          >
            {{ handTypeNames[type] }}
          </button>
        </div>
      </div>

      <!-- 24台 -->
      <div class="mb-3">
        <div class="text-xs text-gray-500 mb-2">24台</div>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="type in getFilteredTai24Types()"
            :key="type"
            @click="selectHandType(type)"
            class="hand-type-button"
            :class="{ active: handTypes.includes(type) }"
          >
            {{ handTypeNames[type] }}
          </button>
        </div>
      </div>

      <!-- 清除牌型 -->
      <div class="flex justify-center">
        <button
          @click="clearHandType"
          class="hand-type-button-clear"
          :class="{ active: handTypes.length === 0 }"
        >
          不記錄牌型
        </button>
      </div>
    </div>

    <!-- 台數計算結果 -->
    <div v-if="winType" class="mb-6">
      <h3 class="font-bold text-gray-700 mb-3">
        {{ winType === WinType.DISCARD ? '5' : '4' }}. 台數與點數計算
      </h3>
      
      <!-- 台數明細 -->
      <div class="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
        <div class="space-y-2 text-sm">
          <!-- 自摸保底 -->
          <div v-if="winType === WinType.SELF_DRAW" class="flex justify-between items-center">
            <span class="text-gray-700">自摸保底</span>
            <span class="font-bold text-green-600">+1 台</span>
          </div>
          
          <!-- 牌型台數 -->
          <div v-if="handTypes.length > 0 && handTypeTai > 0" class="space-y-1">
            <div 
              v-for="type in handTypes" 
              :key="type"
              class="flex justify-between items-center"
            >
              <span class="text-gray-700">{{ handTypeNames[type] }}</span>
              <span class="font-bold text-purple-600">+{{ HAND_TYPE_TAI[type] }} 台</span>
            </div>
            <div v-if="handTypes.length > 1" class="flex justify-between items-center pt-1 border-t border-gray-200">
              <span class="text-gray-700 font-medium">牌型總計</span>
              <span class="font-bold text-purple-600">+{{ handTypeTai }} 台</span>
            </div>
          </div>
          
          <!-- 莊家台數 -->
          <div v-if="dealerExtraTai > 0" class="flex justify-between items-center">
            <span class="text-gray-700">
              <template v-if="isDealerWinner">莊家自摸</template>
              <template v-else-if="isDealerLoser">胡莊家</template>
              <template v-else-if="winType === WinType.SELF_DRAW && !isDealerWinner">莊家台（其他玩家自摸）</template>
              （{{ currentDealerWinCount }}連勝）
            </span>
            <span class="font-bold text-orange-600">+{{ dealerExtraTai }} 台</span>
          </div>
          
          <!-- 總台數與點數 -->
          <div class="pt-2 border-t-2 border-gray-300 space-y-1">
            <div class="flex justify-between items-center">
              <span class="text-gray-800 font-bold text-base">總台數</span>
              <span class="font-bold text-mahjong-green text-xl">{{ calculatedTai }} 台</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-700 text-xs">
                ({{ baseMultiplier }}底 + {{ calculatedTai }}台) × {{ basePoint }}元
                <span v-if="winType === WinType.SELF_DRAW"> × 3</span>
              </span>
              <span class="font-bold text-blue-600 text-lg">
                {{ totalPoints.toLocaleString() }} 元
              </span>
            </div>
            <div v-if="winType === WinType.SELF_DRAW" class="text-xs text-gray-500 text-center pt-1">
              三家總計（各付 {{ perPlayerPoints.toLocaleString() }} 元）
            </div>
            <div v-else class="text-xs text-gray-500 text-center pt-1">
              被胡者支付
            </div>
          </div>
        </div>
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
        ({{ baseMultiplier }}底 + {{ calculatedTai }}台) × {{ basePoint }}元 = {{ (baseMultiplier + calculatedTai) * basePoint }} 元
      </div>
    </div>

    <!-- 操作按鈕 -->
    <div class="space-y-3">
      <!-- 流局按鈕 -->
      <button
        @click="handleDraw"
        class="w-full bg-gray-500 text-white font-bold py-3 px-6 rounded-lg active:scale-95 transition-transform"
      >
        🔄 流局（莊家連勝+1）
      </button>
      
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { WIND_NAMES, HAND_TYPE_NAMES, COMMON_HAND_TYPES, HAND_TYPE_TAI } from '@/constants'
import { calculateScoreChanges } from '@/utils/calculator'
import { WindPosition, WinType, HandType } from '@/types'
import type { Player, ScoreChange } from '@/types'

interface Props {
  players: Player[]
  basePoint: number
  baseMultiplier: number
  enableFlowerTiles?: boolean
  enableHonorTiles?: boolean
  currentDealer?: WindPosition
  dealerWinCount?: number
}

interface Emits {
  (
    e: 'submit',
    data: {
      dealerPosition?: WindPosition
      winnerPosition: WindPosition
      winType: WinType
      tai: number
      loserPosition?: WindPosition
      handTypes?: HandType[]
    }
  ): void
}

const props = withDefaults(defineProps<Props>(), {
  enableFlowerTiles: false,
  enableHonorTiles: false,
  dealerWinCount: 0,
})
const emit = defineEmits<Emits>()

const windNames = WIND_NAMES
// const commonTaiOptions = COMMON_TAI_OPTIONS
const handTypeNames = HAND_TYPE_NAMES
const commonHandTypes = COMMON_HAND_TYPES
const enableFlowerTiles = computed(() => props.enableFlowerTiles)
const enableHonorTiles = computed(() => props.enableHonorTiles)

// 預設莊家為 currentDealer，如果沒有則為東
const defaultDealer = computed(() => props.currentDealer || WindPosition.EAST)

// 當前連莊次數（用於計算莊台）
const currentDealerWinCount = computed(() => props.dealerWinCount || 0)

// 表單資料
const dealerPosition = ref<WindPosition>() // 莊家位置
const winnerPosition = ref<WindPosition>()
const winType = ref<WinType>()
const loserPosition = ref<WindPosition>()
const handTypes = ref<HandType[]>([])

// 監聽 currentDealer 變化，自動更新莊家位置
watch(defaultDealer, (newDealer) => {
  dealerPosition.value = newDealer
}, { immediate: true })

// 可以被選為放炮者的玩家（排除胡牌者）
const losablePlayers = computed(() => {
  return props.players.filter((p) => p.position !== winnerPosition.value)
})

// 判斷是否莊家胡牌
const isDealerWinner = computed(() => {
  return winnerPosition.value === dealerPosition.value
})

// 判斷是否胡了莊家
const isDealerLoser = computed(() => {
  return loserPosition.value === dealerPosition.value
})

// 當前選擇的牌型台數總和
const handTypeTai = computed(() => {
  if (!handTypes.value || handTypes.value.length === 0) return 0
  return handTypes.value.reduce((total, type) => {
    return total + (HAND_TYPE_TAI[type] || 0)
  }, 0)
})

// 莊家額外台數計算：2N + 1（N 為當前連莊次數）
const dealerExtraTai = computed(() => {
  return currentDealerWinCount.value * 2 + 1
})

// 計算總台數（自動計算：牌型 + 莊台 + 自摸保底）
const calculatedTai = computed(() => {
  let total = 0
  
  // 自摸保底1台
  if (winType.value === WinType.SELF_DRAW) {
    total = 1
  }
  
  // 加上牌型台數
  total += handTypeTai.value
  
  // 莊家台數計算：
  // 1. 莊家自摸：加莊家台數
  // 2. 其他玩家自摸：加莊家台數（莊家需要額外支付）
  // 3. 胡莊家：加莊家台數
  if (isDealerWinner.value || isDealerLoser.value || (winType.value === WinType.SELF_DRAW && !isDealerWinner.value)) {
    total += dealerExtraTai.value
  }
  
  // 自摸時確保至少1台
  if (winType.value === WinType.SELF_DRAW) {
    total = Math.max(1, total)
  }
  
  return total
})

// 計算單次點數（金額）
const singlePoints = computed(() => {
  return (props.baseMultiplier + calculatedTai.value) * props.basePoint
})

// 計算總點數（自摸時為三家總計）
const totalPoints = computed(() => {
  if (winType.value === WinType.SELF_DRAW) {
    return singlePoints.value * 3 // 三家總計
  }
  return singlePoints.value
})

// 計算每家應付點數（自摸時）
const perPlayerPoints = computed(() => {
  return singlePoints.value
})

// 是否可以預覽
const canPreview = computed(() => {
  if (!winnerPosition.value || !winType.value) return false
  if (winType.value === WinType.DISCARD && !loserPosition.value) return false
  return true
})

// 是否可以提交
const canSubmit = computed(() => {
  return canPreview.value && calculatedTai.value > 0
})

// 預覽分數變動
const previewScoreChanges = computed<ScoreChange[]>(() => {
  if (!canPreview.value) return []

  return calculateScoreChanges(
    winnerPosition.value!,
    winType.value!,
    loserPosition.value,
    calculatedTai.value!, // 使用計算後的台數
    props.basePoint,
    props.baseMultiplier
  )
})

/**
 * 選擇胡牌者
 * @param position - 胡牌者的風位
 */
function selectWinner(position: WindPosition) {
  winnerPosition.value = position
  // 如果之前選的放炮者是現在的胡牌者，清除放炮者選擇
  if (loserPosition.value === position) {
    loserPosition.value = undefined
  }
}

/**
 * 選擇胡牌類型
 * @param type - 胡牌類型（自摸/放炮）
 */
function selectWinType(type: WinType) {
  winType.value = type
  // 如果選擇自摸，清除放槍者
  if (type === WinType.SELF_DRAW) {
    loserPosition.value = undefined
  }
}

/**
 * 選擇放槍者
 * @param position - 放槍者的風位
 */
function selectLoser(position: WindPosition) {
  loserPosition.value = position
}

/**
 * 選擇/取消選擇牌型（多選）
 * @param type - 牌型
 */
function selectHandType(type: HandType) {
  const index = handTypes.value.indexOf(type)
  if (index > -1) {
    // 如果已選中，則取消選擇
    handTypes.value.splice(index, 1)
  } else {
    // 如果未選中，則添加到選擇列表
    handTypes.value.push(type)
  }
}

/**
 * 清除牌型選擇
 */
function clearHandType() {
  handTypes.value = []
}

/**
 * 獲取玩家名稱
 * @param position - 玩家風位
 * @returns 玩家名稱，如果找不到則返回空字串
 */
function getPlayerName(position: WindPosition): string {
  const player = props.players.find((p) => p.position === position)
  return player ? player.name : ''
}

/**
 * 重置表單
 * 清除所有選擇但保留莊家位置
 */
function handleReset() {
  // 莊家位置不重置，保持當前莊家
  winnerPosition.value = undefined
  winType.value = undefined
  loserPosition.value = undefined
  handTypes.value = []
}

/**
 * 提交表單
 * 將當前記錄提交到遊戲狀態並重置表單
 */
function handleSubmit() {
  if (!canSubmit.value) return

  emit('submit', {
    dealerPosition: dealerPosition.value,
    winnerPosition: winnerPosition.value!,
    winType: winType.value!,
    tai: calculatedTai.value!, // 使用計算後的台數（包含莊家加台）
    loserPosition: loserPosition.value,
    handTypes: handTypes.value,
  })

  // 提交後重置表單
  handleReset()
}

/**
 * 處理流局
 * 提交流局記錄並重置表單
 */
function handleDraw() {
  if (!dealerPosition.value) return
  
  emit('submit', {
    dealerPosition: dealerPosition.value,
    winnerPosition: dealerPosition.value, // 流局時，勝者設為莊家（用於判斷連莊）
    winType: WinType.DRAW,
    tai: 0,
    loserPosition: undefined,
    handTypes: undefined,
  })
  
  // 流局後重置表單
  handleReset()
}

/**
 * 過濾1台牌型：根據遊戲設定顯示相應的牌型
 * @returns 過濾後的1台牌型陣列
 */
function getFilteredTai1Types() {
  const tai1Types = commonHandTypes.tai1.filter(type => {
    // 三元牌和風牌需要啟用見字
    if ([HandType.RED_DRAGON, HandType.GREEN_DRAGON, HandType.WHITE_DRAGON, 
         HandType.EAST_WIND, HandType.SOUTH_WIND, HandType.WEST_WIND, HandType.NORTH_WIND].includes(type)) {
      return enableHonorTiles.value
    }
    // 花牌需要啟用見花
    if (type === HandType.CORRECT_FLOWER) {
      return enableFlowerTiles.value
    }
    // 其他牌型都顯示
    return true
  })
  return tai1Types
}

/**
 * 過濾2台牌型：自摸時不顯示全求人和平胡
 * @returns 過濾後的2台牌型陣列
 */
function getFilteredTai2Types() {
  const tai2Types = commonHandTypes.tai2.filter(type => {
    // 自摸時不顯示全求人和平胡
    if (winType.value === WinType.SELF_DRAW) {
      if ([HandType.ALL_HUMAN, HandType.COMMON].includes(type)) {
        return false
      }
    }
    return true
  })
  return tai2Types
}

/**
 * 過濾4台牌型：根據遊戲設定顯示相應的牌型
 * @returns 過濾後的4台牌型陣列
 */
function getFilteredTai4Types() {
  const tai4Types = commonHandTypes.tai4.filter(type => {
    // 小三元需要啟用見字
    if (type === HandType.SMALL_THREE_DRAGONS) {
      return enableHonorTiles.value
    }
    return true
  })
  return tai4Types
}

/**
 * 過濾8台牌型：根據遊戲設定顯示相應的牌型
 * @returns 過濾後的8台牌型陣列
 */
function getFilteredTai8Types() {
  const tai8Types = commonHandTypes.tai8.filter(type => {
    // 大三元、小四喜需要啟用見字
    if ([HandType.BIG_THREE_DRAGONS, HandType.SMALL_FOUR_WINDS].includes(type)) {
      return enableHonorTiles.value
    }
    // 八仙過海需要啟用見花
    if (type === HandType.ALL_FLOWERS) {
      return enableFlowerTiles.value
    }
    return true
  })
  return tai8Types
}

/**
 * 過濾16台牌型：根據遊戲設定顯示相應的牌型
 * @returns 過濾後的16台牌型陣列
 */
function getFilteredTai16Types() {
  const tai16Types = commonHandTypes.tai16.filter(type => {
    // 大四喜、字一色需要啟用見字
    if ([HandType.BIG_FOUR_WINDS, HandType.ALL_HONORS].includes(type)) {
      return enableHonorTiles.value
    }
    return true
  })
  return tai16Types
}

/**
 * 過濾24台牌型：返回所有24台牌型
 * @returns 24台牌型陣列
 */
function getFilteredTai24Types() {
  return commonHandTypes.tai24
}
</script>

<style scoped>
.player-button {
  @apply bg-white border-2 border-gray-300 rounded-lg py-3 px-2 transition-all active:scale-95;
}

.player-button.active {
  @apply border-mahjong-green bg-green-50 ring-2 ring-mahjong-green;
}

.player-button.dealer-button {
  @apply border-4 border-yellow-400;
  box-shadow: 0 0 0 1px rgba(234, 179, 8, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.player-button.dealer-button.active {
  @apply border-mahjong-green bg-green-50;
  box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.3), 0 0 0 4px rgb(26, 95, 63);
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

.hand-type-button {
  @apply bg-white border-2 border-gray-300 rounded-lg py-2 px-2 text-xs font-medium transition-all active:scale-95;
}

.hand-type-button.active {
  @apply border-purple-500 bg-purple-50 ring-2 ring-purple-500 text-purple-700;
}

.hand-type-button-clear {
  @apply bg-white border-2 border-gray-300 rounded-lg py-2 px-2 text-xs font-medium transition-all active:scale-95;
}

.hand-type-button-clear.active {
  @apply border-gray-500 bg-gray-100 ring-2 ring-gray-400;
}
</style>

