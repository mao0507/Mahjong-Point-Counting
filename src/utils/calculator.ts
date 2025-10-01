import { WindPosition, WinType, ScoreChange } from '@/types'

/**
 * 計算分數變動
 * @param winnerPosition 胡牌者位置
 * @param winType 胡牌類型
 * @param loserPosition 放炮者位置（放炮時必須）
 * @param tai 台數
 * @param basePoint 底分
 * @param baseMultiplier 底（基礎台數）
 * @returns 所有玩家的分數變動
 */
export function calculateScoreChanges(
  winnerPosition: WindPosition,
  winType: WinType,
  loserPosition: WindPosition | undefined,
  tai: number,
  basePoint: number,
  baseMultiplier: number
): ScoreChange[] {
  // 總分 = (底 + 台) × 底分
  const totalPoints = (baseMultiplier + tai) * basePoint
  const scoreChanges: ScoreChange[] = []

  if (winType === WinType.SELF_DRAW) {
    // 自摸：其他三家各付 totalPoints
    const allPositions = Object.values(WindPosition)

    allPositions.forEach((position) => {
      if (position === winnerPosition) {
        // 胡牌者得分 = totalPoints * 3
        scoreChanges.push({
          position,
          change: totalPoints * 3,
        })
      } else {
        // 其他三家各失分 totalPoints
        scoreChanges.push({
          position,
          change: -totalPoints,
        })
      }
    })
  } else if (winType === WinType.DISCARD && loserPosition) {
    // 放炮：放炮者付全額
    const allPositions = Object.values(WindPosition)

    allPositions.forEach((position) => {
      if (position === winnerPosition) {
        // 胡牌者得分 = totalPoints
        scoreChanges.push({
          position,
          change: totalPoints,
        })
      } else if (position === loserPosition) {
        // 放炮者失分 = totalPoints
        scoreChanges.push({
          position,
          change: -totalPoints,
        })
      } else {
        // 其他玩家不變
        scoreChanges.push({
          position,
          change: 0,
        })
      }
    })
  }

  return scoreChanges
}

/**
 * 格式化分數顯示
 * @param score 分數
 * @returns 格式化的分數字串（帶正負號）
 */
export function formatScore(score: number): string {
  if (score > 0) {
    return `+${score}`
  }
  return score.toString()
}

/**
 * 計算總分
 * @param currentScore 當前分數
 * @param change 分數變動
 * @returns 新的總分
 */
export function calculateTotalScore(
  currentScore: number,
  change: number
): number {
  return currentScore + change
}
