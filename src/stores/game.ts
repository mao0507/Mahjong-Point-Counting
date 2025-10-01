import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  GameState,
  Player,
  GameRound,
  GameSettings,
  WindPosition,
  WinType,
} from '@/types'
import { DEFAULT_GAME_SETTINGS, STORAGE_KEYS, WIND_ORDER } from '@/constants'
import { calculateScoreChanges, calculateTotalScore } from '@/utils/calculator'
import {
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
} from '@/utils/storage'

export const useGameStore = defineStore('game', () => {
  // 狀態
  const gameState = ref<GameState | null>(null)

  // 計算屬性
  const isGameActive = computed(() => gameState.value?.isActive ?? false)
  const currentPlayers = computed(() => gameState.value?.players ?? [])
  const currentRounds = computed(() => gameState.value?.rounds ?? [])
  const currentSettings = computed(
    () => gameState.value?.settings ?? DEFAULT_GAME_SETTINGS
  )

  /**
   * 初始化新遊戲
   */
  function startNewGame(
    playerNames: string[],
    settings?: Partial<GameSettings>
  ) {
    const now = Date.now()
    const gameId = `game_${now}`

    const players: Player[] = WIND_ORDER.map((position, index) => ({
      id: `player_${index}`,
      name: playerNames[index] || `玩家${index + 1}`,
      position,
      totalScore:
        settings?.startingScore ?? DEFAULT_GAME_SETTINGS.startingScore,
    }))

    gameState.value = {
      gameId,
      startTime: now,
      players,
      rounds: [],
      settings: {
        ...DEFAULT_GAME_SETTINGS,
        ...settings,
      },
      currentRoundNumber: 1,
      isActive: true,
    }

    // 儲存到本地
    saveGameState()
  }

  /**
   * 新增一局記錄
   */
  function addRound(
    winnerPosition: WindPosition,
    winType: WinType,
    tai: number,
    loserPosition?: WindPosition
  ) {
    if (!gameState.value) {
      console.error('遊戲狀態不存在，無法新增記錄')
      return
    }

    const { settings, currentRoundNumber } = gameState.value

    console.log('新增記錄：', {
      winnerPosition,
      winType,
      tai,
      loserPosition,
      basePoint: settings.basePoint,
      baseMultiplier: settings.baseMultiplier,
    })

    // 計算分數變動
    const scoreChanges = calculateScoreChanges(
      winnerPosition,
      winType,
      loserPosition,
      tai,
      settings.basePoint,
      settings.baseMultiplier
    )

    console.log('計算的分數變動：', scoreChanges)

    // 更新玩家分數
    scoreChanges.forEach(({ position, change }) => {
      const player = gameState.value!.players.find(
        (p) => p.position === position
      )
      if (player) {
        player.totalScore = calculateTotalScore(player.totalScore, change)
      }
    })

    // 新增記錄
    const round: GameRound = {
      id: `round_${Date.now()}`,
      roundNumber: currentRoundNumber,
      timestamp: Date.now(),
      winnerPosition,
      winType,
      loserPosition,
      tai,
      basePoint: settings.basePoint,
      baseMultiplier: settings.baseMultiplier,
      scoreChanges,
    }

    gameState.value.rounds.push(round)
    gameState.value.currentRoundNumber += 1

    // 儲存到本地
    saveGameState()
  }

  /**
   * 刪除指定局記錄
   */
  function deleteRound(roundId: string) {
    if (!gameState.value) return

    const roundIndex = gameState.value.rounds.findIndex((r) => r.id === roundId)
    if (roundIndex === -1) return

    // 移除該局之後的所有記錄
    const removedRounds = gameState.value.rounds.splice(roundIndex)

    // 重新計算所有玩家分數
    recalculateAllScores()

    // 儲存到本地
    saveGameState()
  }

  /**
   * 重新計算所有玩家分數
   */
  function recalculateAllScores() {
    if (!gameState.value) return

    // 重置所有玩家分數
    gameState.value.players.forEach((player) => {
      player.totalScore = gameState.value!.settings.startingScore
    })

    // 依序套用每局的分數變動
    gameState.value.rounds.forEach((round) => {
      round.scoreChanges.forEach(({ position, change }) => {
        const player = gameState.value!.players.find(
          (p) => p.position === position
        )
        if (player) {
          player.totalScore = calculateTotalScore(player.totalScore, change)
        }
      })
    })
  }

  /**
   * 結束遊戲
   */
  function endGame() {
    if (!gameState.value) return
    gameState.value.isActive = false
    saveGameState()
  }

  /**
   * 儲存遊戲狀態
   */
  function saveGameState() {
    if (gameState.value) {
      saveToStorage(STORAGE_KEYS.CURRENT_GAME, gameState.value)
    }
  }

  /**
   * 載入遊戲狀態
   */
  function loadGameState() {
    const savedState = loadFromStorage<GameState>(STORAGE_KEYS.CURRENT_GAME)
    if (savedState) {
      // 相容舊資料：如果 settings 沒有 baseMultiplier，補上預設值
      if (
        !savedState.settings.baseMultiplier &&
        savedState.settings.baseMultiplier !== 0
      ) {
        savedState.settings.baseMultiplier =
          DEFAULT_GAME_SETTINGS.baseMultiplier
      }

      // 相容舊資料：如果 rounds 沒有 baseMultiplier，補上當時的設定值
      savedState.rounds.forEach((round) => {
        if (!round.baseMultiplier && round.baseMultiplier !== 0) {
          round.baseMultiplier = savedState.settings.baseMultiplier
        }
      })

      gameState.value = savedState
    }
  }

  /**
   * 清除遊戲狀態
   */
  function clearGameState() {
    gameState.value = null
    removeFromStorage(STORAGE_KEYS.CURRENT_GAME)
  }

  return {
    // 狀態
    gameState,
    isGameActive,
    currentPlayers,
    currentRounds,
    currentSettings,

    // 方法
    startNewGame,
    addRound,
    deleteRound,
    endGame,
    loadGameState,
    clearGameState,
    recalculateAllScores,
  }
})
