import { WindPosition, HandType } from '@/types'

/**
 * 風位顯示名稱
 */
export const WIND_NAMES: Record<WindPosition, string> = {
  [WindPosition.EAST]: '東',
  [WindPosition.SOUTH]: '南',
  [WindPosition.WEST]: '西',
  [WindPosition.NORTH]: '北',
}

/**
 * 和牌牌型顯示名稱（台灣麻將）
 */
export const HAND_TYPE_NAMES: Record<HandType, string> = {
  [HandType.BUTT_HU]: '屁胡',
  [HandType.COMMON]: '平胡',
  [HandType.CONCEALED_HAND]: '門清',
  [HandType.ALL_PUNGS]: '碰碰胡',
  [HandType.MIXED_ONE_SUIT]: '混一色',
  [HandType.ALL_ONE_SUIT]: '清一色',
  [HandType.LIU_LIU]: '嚦咕嚦咕',
  [HandType.KONG_ON_KONG]: '槓上開花',
  [HandType.ROBBING_KONG]: '搶槓',
  [HandType.RED_DRAGON]: '紅中',
  [HandType.GREEN_DRAGON]: '青發',
  [HandType.WHITE_DRAGON]: '白板',
  [HandType.SMALL_THREE_DRAGONS]: '小三元',
  [HandType.BIG_THREE_DRAGONS]: '大三元',
  [HandType.EAST_WIND]: '東風',
  [HandType.SOUTH_WIND]: '南風',
  [HandType.WEST_WIND]: '西風',
  [HandType.NORTH_WIND]: '北風',
  [HandType.SMALL_FOUR_WINDS]: '小四喜',
  [HandType.BIG_FOUR_WINDS]: '大四喜',
  [HandType.CORRECT_FLOWER]: '正花',
  [HandType.ALL_FLOWERS]: '八仙過海',
  [HandType.LAST_TILE_DRAW]: '海底撈月',
  [HandType.BLESSING_OF_HEAVEN]: '天胡',
  [HandType.BLESSING_OF_EARTH]: '地胡',
  [HandType.ALL_HONORS]: '字一色',
  [HandType.ALL_HUMAN]: '全求人',
  [HandType.THREE_CONCEALED_PUNGS]: '三暗刻',
  [HandType.FOUR_CONCEALED_PUNGS]: '四暗刻',
  [HandType.FIVE_CONCEALED_PUNGS]: '五暗刻',
  [HandType.WAITING_ONE]: '單吊',
  [HandType.EDGE_WAIT]: '邊張',
  [HandType.MIDDLE_WAIT]: '中洞',
  [HandType.MIGI]: 'migi',
}

/**
 * 常用和牌牌型選項（台灣麻將，按台數分組）
 */
export const COMMON_HAND_TYPES = {
  // 0台
  tai0: [HandType.BUTT_HU],
  // 1台
  tai1: [
    HandType.CONCEALED_HAND,
    HandType.WAITING_ONE,
    HandType.EDGE_WAIT,
    HandType.MIDDLE_WAIT,
    HandType.KONG_ON_KONG,
    HandType.ROBBING_KONG,
    HandType.RED_DRAGON,
    HandType.GREEN_DRAGON,
    HandType.WHITE_DRAGON,
    HandType.EAST_WIND,
    HandType.SOUTH_WIND,
    HandType.WEST_WIND,
    HandType.NORTH_WIND,
    HandType.CORRECT_FLOWER,
    HandType.LAST_TILE_DRAW,
  ],
  // 2台
  tai2: [
    HandType.COMMON,
    HandType.ALL_PUNGS,
    HandType.ALL_HUMAN,
    HandType.THREE_CONCEALED_PUNGS,
  ],
  // 4台
  tai4: [
    HandType.MIXED_ONE_SUIT,
    HandType.FOUR_CONCEALED_PUNGS,
    HandType.SMALL_THREE_DRAGONS,
  ],
  // 8台
  tai8: [
    HandType.FIVE_CONCEALED_PUNGS,
    HandType.BIG_THREE_DRAGONS,
    HandType.SMALL_FOUR_WINDS,
    HandType.ALL_FLOWERS,
    HandType.ALL_ONE_SUIT,
    HandType.LIU_LIU,
    HandType.MIGI,
  ],
  // 16台
  tai16: [
    HandType.BIG_FOUR_WINDS,
    HandType.BLESSING_OF_EARTH,
    HandType.ALL_HONORS,
  ],
  // 24台
  tai24: [HandType.BLESSING_OF_HEAVEN],
}

/**
 * 風位順序
 */
export const WIND_ORDER: WindPosition[] = [
  WindPosition.EAST,
  WindPosition.SOUTH,
  WindPosition.WEST,
  WindPosition.NORTH,
]

/**
 * 莊家輪換順序（東、南、西、北）
 */
export const DEALER_ROTATION_ORDER: WindPosition[] = [
  WindPosition.EAST,
  WindPosition.SOUTH,
  WindPosition.WEST,
  WindPosition.NORTH,
]

/**
 * 預設遊戲設定
 */
export const DEFAULT_GAME_SETTINGS = {
  basePoint: 10, // 底分 10 元
  baseMultiplier: 2, // 底 2 底
  startingScore: 0, // 起始分數 0
  enableContinuousDealer: false, // 不啟用連莊
  enableFlowerTiles: false, // 不啟用見花
  enableHonorTiles: false, // 不啟用見字
  enableLiuLiu: false, // 不啟用嚦咕嚦咕
}

/**
 * 常用台數選項
 */
export const COMMON_TAI_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16]

/**
 * 牌型對應的台數（台灣麻將常見規則）
 */
export const HAND_TYPE_TAI: Record<HandType, number> = {
  // 基本牌型
  [HandType.BUTT_HU]: 0, // 屁胡
  [HandType.COMMON]: 2, // 平胡
  [HandType.CONCEALED_HAND]: 1, // 門清
  [HandType.ALL_PUNGS]: 2, // 碰碰胡
  [HandType.MIXED_ONE_SUIT]: 4, // 混一色
  [HandType.ALL_HUMAN]: 2, // 全求人
  [HandType.THREE_CONCEALED_PUNGS]: 2, // 三暗刻
  [HandType.FOUR_CONCEALED_PUNGS]: 4, // 四暗刻
  [HandType.FIVE_CONCEALED_PUNGS]: 8, // 五暗刻
  [HandType.WAITING_ONE]: 1, // 單吊
  [HandType.EDGE_WAIT]: 1, // 邊張
  [HandType.MIDDLE_WAIT]: 1, // 中洞
  [HandType.MIGI]: 8, // migi

  // 槓相關
  [HandType.KONG_ON_KONG]: 1, // 槓上開花
  [HandType.ROBBING_KONG]: 1, // 搶槓

  // 三元牌
  [HandType.RED_DRAGON]: 1, // 紅中
  [HandType.GREEN_DRAGON]: 1, // 青發
  [HandType.WHITE_DRAGON]: 1, // 白板
  [HandType.SMALL_THREE_DRAGONS]: 4, // 小三元
  [HandType.BIG_THREE_DRAGONS]: 8, // 大三元

  // 風牌
  [HandType.EAST_WIND]: 1, // 東風
  [HandType.SOUTH_WIND]: 1, // 南風
  [HandType.WEST_WIND]: 1, // 西風
  [HandType.NORTH_WIND]: 1, // 北風
  [HandType.SMALL_FOUR_WINDS]: 8, // 小四喜
  [HandType.BIG_FOUR_WINDS]: 16, // 大四喜

  // 花牌
  [HandType.CORRECT_FLOWER]: 1, // 正花
  [HandType.ALL_FLOWERS]: 8, // 八仙過海

  // 特殊胡法
  [HandType.LAST_TILE_DRAW]: 1, // 海底撈月
  [HandType.BLESSING_OF_HEAVEN]: 24, // 天胡
  [HandType.BLESSING_OF_EARTH]: 16, // 地胡

  // 大牌型
  [HandType.ALL_HONORS]: 16, // 字一色
  [HandType.ALL_ONE_SUIT]: 8, // 清一色
  [HandType.LIU_LIU]: 8, // 嚦咕嚦咕
}

/**
 * 本地儲存 Key
 */
export const STORAGE_KEYS = {
  CURRENT_GAME: 'mahjong_current_game',
  GAME_SETTINGS: 'mahjong_game_settings',
  GAME_HISTORY: 'mahjong_game_history',
}
