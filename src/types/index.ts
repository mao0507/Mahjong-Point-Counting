/**
 * 玩家位置（風位）
 */
export enum WindPosition {
  EAST = 'east', // 東
  SOUTH = 'south', // 南
  WEST = 'west', // 西
  NORTH = 'north', // 北
}

/**
 * 玩家資訊
 */
export interface Player {
  id: string
  name: string
  position: WindPosition
  totalScore: number
}

/**
 * 胡牌類型
 */
export enum WinType {
  SELF_DRAW = 'self_draw', // 自摸
  DISCARD = 'discard', // 放炮
}

/**
 * 單局記錄
 */
export interface GameRound {
  id: string
  roundNumber: number // 第幾局
  timestamp: number // 時間戳記
  winnerPosition: WindPosition // 胡牌者位置
  winType: WinType // 胡牌類型
  loserPosition?: WindPosition // 放炮者位置（如果是放炮）
  tai: number // 台數
  basePoint: number // 底分
  baseMultiplier: number // 底（基礎台數）
  scoreChanges: ScoreChange[] // 分數變動
}

/**
 * 分數變動記錄
 */
export interface ScoreChange {
  position: WindPosition
  change: number // 正數為得分，負數為失分
}

/**
 * 遊戲設定
 */
export interface GameSettings {
  basePoint: number // 底分（每台的分數，例如：10元）
  baseMultiplier: number // 底（基礎台數，例如：2底）
  startingScore: number // 起始分數
  enableContinuousDealer: boolean // 是否啟用連莊
}

/**
 * 遊戲狀態
 */
export interface GameState {
  gameId: string
  startTime: number
  players: Player[]
  rounds: GameRound[]
  settings: GameSettings
  currentRoundNumber: number
  isActive: boolean
}

/**
 * 統計資料
 */
export interface PlayerStatistics {
  position: WindPosition
  name: string
  totalWins: number // 總胡牌次數
  selfDrawWins: number // 自摸次數
  discardWins: number // 放炮贏的次數
  totalLoses: number // 放炮次數
  winRate: number // 胡牌率
  averageWinPoints: number // 平均贏分
  maxWinPoints: number // 最高單局得分
  finalScore: number // 最終分數
}
