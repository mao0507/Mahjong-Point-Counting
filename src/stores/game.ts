import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { WindPosition, WinType, HandType } from '@/types'
import type { GameState, Player, GameRound, GameSettings } from '@/types'
import type { ScoreChange } from '@/types'
import {
  DEFAULT_GAME_SETTINGS,
  STORAGE_KEYS,
  WIND_ORDER,
  DEALER_ROTATION_ORDER,
} from '@/constants'
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
   * @param playerNames - 玩家名稱陣列，長度應為4
   * @param settings - 可選的遊戲設定，會與預設設定合併
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
      currentDealer: WindPosition.EAST, // 預設從東開始
      dealerWinCount: 0, // 莊家連勝次數初始為 0
      isActive: true,
    }

    // 儲存到本地
    saveGameState()
  }

  /**
   * 新增一局記錄
   * @param winnerPosition - 胡牌者位置
   * @param winType - 胡牌類型（自摸/放炮/流局）
   * @param tai - 台數
   * @param loserPosition - 放炮者位置（放炮時必須提供）
   * @param handTypes - 牌型陣列（可選，支持多選）
   */
  function addRound(
    winnerPosition: WindPosition,
    winType: WinType,
    tai: number,
    loserPosition?: WindPosition,
    handTypes?: HandType[]
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

    // 判斷是否流局
    const isDraw = winType === 'draw'
    const currentDealerPosition = gameState.value.currentDealer

    let scoreChanges: ScoreChange[] = []
    let isDealerWin = false
    let nextDealerPosition = currentDealerPosition

    if (isDraw) {
      // 流局：沒有分數變動，莊家連勝+1
      scoreChanges = []
      isDealerWin = true // 視為莊家勝利（連莊）
      nextDealerPosition = currentDealerPosition // 莊家不變
      gameState.value.dealerWinCount += 1 // 連勝次數 +1
    } else {
      // 正常胡牌
      // 計算分數變動
      scoreChanges = calculateScoreChanges(
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

      // 判斷是否莊家胡牌
      isDealerWin = winnerPosition === currentDealerPosition

      // 更新莊家連勝次數
      if (isDealerWin) {
        gameState.value.dealerWinCount += 1 // 莊家胡牌，連勝次數 +1
      }

      // 計算下一局莊家
      nextDealerPosition = isDealerWin
        ? currentDealerPosition // 連莊
        : getNextDealer(currentDealerPosition) // 換莊
    }

    // 新增記錄
    const round: GameRound = {
      id: `round_${Date.now()}`,
      roundNumber: currentRoundNumber,
      timestamp: Date.now(),
      dealerPosition: currentDealerPosition,
      nextDealer: nextDealerPosition,
      isDealerWin,
      dealerWinCount: gameState.value.dealerWinCount, // 記錄當前連勝次數
      winnerPosition,
      winType,
      loserPosition,
      handTypes,
      tai,
      basePoint: settings.basePoint,
      baseMultiplier: settings.baseMultiplier,
      scoreChanges,
    }

    gameState.value.rounds.push(round)
    gameState.value.currentRoundNumber += 1

    // 更新莊家
    gameState.value.currentDealer = nextDealerPosition

    // 如果換莊，重置連勝次數
    if (!isDealerWin) {
      gameState.value.dealerWinCount = 0
    }

    // 儲存到本地
    saveGameState()
  }

  /**
   * 取得下一位莊家（東→南→西→北）
   * @param currentDealer - 當前莊家位置
   * @returns 下一位莊家位置
   */
  function getNextDealer(currentDealer: WindPosition): WindPosition {
    const currentIndex = DEALER_ROTATION_ORDER.indexOf(currentDealer)
    const nextIndex = (currentIndex + 1) % DEALER_ROTATION_ORDER.length
    return DEALER_ROTATION_ORDER[nextIndex]
  }

  /**
   * 刪除指定局記錄
   * 注意：會同時刪除該局之後的所有記錄，並重新計算分數
   * @param roundId - 要刪除的局數ID
   */
  function deleteRound(roundId: string) {
    if (!gameState.value) return

    const roundIndex = gameState.value.rounds.findIndex((r) => r.id === roundId)
    if (roundIndex === -1) return

    // 移除該局之後的所有記錄
    gameState.value.rounds.splice(roundIndex)

    // 重新計算所有玩家分數
    recalculateAllScores()

    // 儲存到本地
    saveGameState()
  }

  /**
   * 重新計算所有玩家分數
   * 從起始分數開始，依序套用所有局數的分數變動
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
   * 將遊戲狀態設為非活躍並儲存
   */
  function endGame() {
    if (!gameState.value) return
    gameState.value.isActive = false
    saveGameState()
  }

  /**
   * 儲存遊戲狀態到 localStorage
   * 如果遊戲狀態不存在則不執行任何操作
   */
  function saveGameState() {
    if (gameState.value) {
      saveToStorage(STORAGE_KEYS.CURRENT_GAME, gameState.value)
    }
  }

  /**
   * 從 localStorage 載入遊戲狀態
   * 包含舊資料相容性處理，會自動補上缺失的設定值
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

      // 相容舊資料：如果 settings 沒有 enableFlowerTiles，補上預設值
      if (savedState.settings.enableFlowerTiles === undefined) {
        savedState.settings.enableFlowerTiles =
          DEFAULT_GAME_SETTINGS.enableFlowerTiles
      }

      // 相容舊資料：如果 settings 沒有 enableHonorTiles，補上預設值
      if (savedState.settings.enableHonorTiles === undefined) {
        savedState.settings.enableHonorTiles =
          DEFAULT_GAME_SETTINGS.enableHonorTiles
      }

      // 相容舊資料：如果 settings 沒有 enableLiuLiu，補上預設值
      if (savedState.settings.enableLiuLiu === undefined) {
        savedState.settings.enableLiuLiu = DEFAULT_GAME_SETTINGS.enableLiuLiu
      }

      // 相容舊資料：如果沒有 currentDealer，預設為東
      if (!savedState.currentDealer) {
        savedState.currentDealer = WindPosition.EAST
      }

      // 相容舊資料：如果沒有 dealerWinCount，預設為 0
      if (savedState.dealerWinCount === undefined) {
        savedState.dealerWinCount = 0
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
   * 將遊戲狀態設為 null 並從 localStorage 中刪除
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
