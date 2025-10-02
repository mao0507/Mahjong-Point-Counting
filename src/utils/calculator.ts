import { WindPosition, WinType, ScoreChange } from '@/types'

/**
 * 計算分數變動
 * @param winnerPosition 胡牌者位置
 * @param winType 胡牌類型
 * @param loserPosition 放炮者位置（放炮時必須）
 * @param tai 台數
 * @param basePoint 底分
 * @param baseMultiplier 底（基礎台數）
 * @param dealerPosition 莊家位置（用於計算莊家台數）
 * @param dealerWinCount 莊家連莊次數（用於計算莊家台數）
 * @returns 所有玩家的分數變動
 */
export function calculateScoreChanges(
  winnerPosition: WindPosition,
  winType: WinType,
  loserPosition: WindPosition | undefined,
  tai: number,
  basePoint: number,
  baseMultiplier: number,
  dealerPosition?: WindPosition,
  dealerWinCount?: number
): ScoreChange[] {
  // 總分 = (底 + 台) × 底分
  const totalPoints = (baseMultiplier + tai) * basePoint
  const scoreChanges: ScoreChange[] = []

  if (winType === WinType.SELF_DRAW) {
    // 自摸：莊家和閒家支付不同金額
    const allPositions = Object.values(WindPosition)

    // 計算莊家台數
    const dealerExtraTai =
      dealerPosition && dealerWinCount !== undefined
        ? dealerWinCount * 2 + 1
        : 0

    // 判斷是否為莊家自摸
    const isDealerWinner = winnerPosition === dealerPosition

    if (isDealerWinner) {
      // 莊家自摸：三家都支付相同金額（包含莊家台）
      const dealerPoints = (baseMultiplier + tai) * basePoint

      allPositions.forEach((position) => {
        if (position === winnerPosition) {
          // 胡牌者得分 = dealerPoints * 3
          scoreChanges.push({
            position,
            change: dealerPoints * 3,
          })
        } else {
          // 其他三家各失分 dealerPoints
          scoreChanges.push({
            position,
            change: -dealerPoints,
          })
        }
      })
    } else {
      // 其他玩家自摸：莊家支付包含莊家台，閒家只支付基本台數
      const baseTai = tai - dealerExtraTai
      const basePoints = (baseMultiplier + baseTai) * basePoint
      const dealerPoints = (baseMultiplier + tai) * basePoint

      allPositions.forEach((position) => {
        if (position === winnerPosition) {
          // 胡牌者得分：莊家支付的金額 + 兩個閒家支付的金額
          let winnerPoints = 0
          allPositions.forEach((p) => {
            if (p !== winnerPosition) {
              if (p === dealerPosition && dealerPosition) {
                winnerPoints += dealerPoints
              } else {
                winnerPoints += basePoints
              }
            }
          })
          scoreChanges.push({
            position,
            change: winnerPoints,
          })
        } else {
          // 其他玩家失分
          if (position === dealerPosition && dealerPosition) {
            // 莊家支付包含莊家台的完整金額
            scoreChanges.push({
              position,
              change: -dealerPoints,
            })
          } else {
            // 閒家只支付基本台數（不含莊家台）
            scoreChanges.push({
              position,
              change: -basePoints,
            })
          }
        }
      })
    }
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
