import { computed } from 'vue'
import type { GameState, PlayerStatistics, WindPosition } from '@/types'
import { WIND_ORDER } from '@/constants'

/**
 * 統計資料 composable
 * 提供遊戲統計相關的計算屬性和方法
 * @param gameState - 遊戲狀態，可以是 null
 * @returns 包含統計資料的響應式對象
 */
export function useStatistics(gameState: GameState | null) {
  /**
   * 計算所有玩家的統計資料
   */
  const playerStatistics = computed<PlayerStatistics[]>(() => {
    if (!gameState) return []

    return WIND_ORDER.map((position) => {
      const player = gameState.players.find((p) => p.position === position)
      if (!player) {
        return createEmptyStatistics(position, '')
      }

      const rounds = gameState.rounds

      // 總胡牌次數
      const totalWins = rounds.filter(
        (r) => r.winnerPosition === position
      ).length

      // 自摸次數
      const selfDrawWins = rounds.filter(
        (r) => r.winnerPosition === position && r.winType === 'self_draw'
      ).length

      // 放炮贏的次數
      const discardWins = rounds.filter(
        (r) => r.winnerPosition === position && r.winType === 'discard'
      ).length

      // 放炮次數
      const totalLoses = rounds.filter(
        (r) => r.loserPosition === position
      ).length

      // 胡牌率
      const winRate = rounds.length > 0 ? totalWins / rounds.length : 0

      // 贏的局數的總得分
      const winRounds = rounds.filter((r) => r.winnerPosition === position)
      const totalWinPoints = winRounds.reduce((sum, round) => {
        const change = round.scoreChanges.find((c) => c.position === position)
        return sum + (change?.change || 0)
      }, 0)

      // 平均贏分
      const averageWinPoints = totalWins > 0 ? totalWinPoints / totalWins : 0

      // 最高單局得分
      const maxWinPoints = winRounds.reduce((max, round) => {
        const change = round.scoreChanges.find((c) => c.position === position)
        const points = change?.change || 0
        return points > max ? points : max
      }, 0)

      return {
        position,
        name: player.name,
        totalWins,
        selfDrawWins,
        discardWins,
        totalLoses,
        winRate,
        averageWinPoints,
        maxWinPoints,
        finalScore: player.totalScore,
      }
    })
  })

  /**
   * 排序後的玩家統計（按最終分數降序）
   */
  const sortedByScore = computed<PlayerStatistics[]>(() => {
    return [...playerStatistics.value].sort(
      (a, b) => b.finalScore - a.finalScore
    )
  })

  /**
   * 贏家（最高分）
   */
  const winner = computed<PlayerStatistics | null>(() => {
    if (sortedByScore.value.length === 0) return null
    return sortedByScore.value[0]
  })

  /**
   * 總局數
   */
  const totalRounds = computed(() => {
    return gameState?.rounds.length || 0
  })

  /**
   * 最大單局台數
   */
  const maxTai = computed(() => {
    if (!gameState) return 0
    return Math.max(...gameState.rounds.map((r) => r.tai), 0)
  })

  /**
   * 平均台數
   */
  const averageTai = computed(() => {
    if (!gameState || gameState.rounds.length === 0) return 0
    const totalTai = gameState.rounds.reduce((sum, r) => sum + r.tai, 0)
    return totalTai / gameState.rounds.length
  })

  return {
    playerStatistics,
    sortedByScore,
    winner,
    totalRounds,
    maxTai,
    averageTai,
  }
}

/**
 * 建立空的統計資料
 * @param position - 玩家風位
 * @param name - 玩家名稱
 * @returns 空的玩家統計資料對象
 */
function createEmptyStatistics(
  position: WindPosition,
  name: string
): PlayerStatistics {
  return {
    position,
    name,
    totalWins: 0,
    selfDrawWins: 0,
    discardWins: 0,
    totalLoses: 0,
    winRate: 0,
    averageWinPoints: 0,
    maxWinPoints: 0,
    finalScore: 0,
  }
}
