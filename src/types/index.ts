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
  DRAW = 'draw', // 流局
}

/**
 * 和牌牌型（台灣麻將）
 */
export enum HandType {
  // 基本牌型
  BUTT_HU = 'butt_hu', // 屁胡
  COMMON = 'common', // 平胡
  CONCEALED_HAND = 'concealed_hand', // 門清
  ALL_PUNGS = 'all_pungs', // 碰碰胡
  MIXED_ONE_SUIT = 'mixed_one_suit', // 混一色
  ALL_HUMAN = 'all_human', // 全求人
  THREE_CONCEALED_PUNGS = 'three_concealed_pungs', // 三暗刻
  FOUR_CONCEALED_PUNGS = 'four_concealed_pungs', // 四暗刻
  FIVE_CONCEALED_PUNGS = 'five_concealed_pungs', // 五暗刻
  WAITING_ONE = 'waiting_one', // 單吊
  EDGE_WAIT = 'edge_wait', // 邊張
  MIDDLE_WAIT = 'middle_wait', // 中洞
  MIGI = 'migi', // migi

  // 槓相關
  KONG_ON_KONG = 'kong_on_kong', // 槓上開花
  ROBBING_KONG = 'robbing_kong', // 搶槓

  // 三元牌（與見字設定相關）
  RED_DRAGON = 'red_dragon', // 紅中
  GREEN_DRAGON = 'green_dragon', // 青發
  WHITE_DRAGON = 'white_dragon', // 白板
  SMALL_THREE_DRAGONS = 'small_three_dragons', // 小三元
  BIG_THREE_DRAGONS = 'big_three_dragons', // 大三元

  // 風牌（與見字設定相關）
  EAST_WIND = 'east_wind', // 東風
  SOUTH_WIND = 'south_wind', // 南風
  WEST_WIND = 'west_wind', // 西風
  NORTH_WIND = 'north_wind', // 北風
  SMALL_FOUR_WINDS = 'small_four_winds', // 小四喜
  BIG_FOUR_WINDS = 'big_four_winds', // 大四喜

  // 花牌（與見花設定相關）
  CORRECT_FLOWER = 'correct_flower', // 正花（自己門風對應的花）
  ALL_FLOWERS = 'all_flowers', // 八仙過海（8張花牌）

  // 特殊胡法
  LAST_TILE_DRAW = 'last_tile_draw', // 海底撈月
  BLESSING_OF_HEAVEN = 'blessing_of_heaven', // 天胡
  BLESSING_OF_EARTH = 'blessing_of_earth', // 地胡

  // 大牌型
  ALL_HONORS = 'all_honors', // 字一色
  ALL_ONE_SUIT = 'all_one_suit', // 清一色
  LIU_LIU = 'liu_liu', // 嚦咕嚦咕
}

/**
 * 單局記錄
 */
export interface GameRound {
  id: string
  roundNumber: number // 第幾局
  timestamp: number // 時間戳記
  dealerPosition?: WindPosition // 本局莊家位置
  nextDealer?: WindPosition // 下一局莊家位置
  isDealerWin?: boolean // 是否莊家胡牌（連莊）
  dealerWinCount?: number // 莊家連勝次數（本局結束後）
  winnerPosition: WindPosition // 胡牌者位置
  winType: WinType // 胡牌類型
  loserPosition?: WindPosition // 放炮者位置（如果是放炮）
  handType?: HandType // 和牌牌型（可選）
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
  enableFlowerTiles: boolean // 是否啟用見花（花牌加台）
  enableHonorTiles: boolean // 是否啟用見字（字牌加台）
  enableLiuLiu: boolean // 是否啟用嚦咕嚦咕（未胡家互相比大小）
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
  currentDealer: WindPosition // 當前莊家
  dealerWinCount: number // 莊家連勝次數（連莊次數）
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
