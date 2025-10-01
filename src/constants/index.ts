import { WindPosition } from '@/types'

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
 * 風位順序
 */
export const WIND_ORDER: WindPosition[] = [
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
}

/**
 * 常用台數選項
 */
export const COMMON_TAI_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16]

/**
 * 本地儲存 Key
 */
export const STORAGE_KEYS = {
  CURRENT_GAME: 'mahjong_current_game',
  GAME_SETTINGS: 'mahjong_game_settings',
  GAME_HISTORY: 'mahjong_game_history',
}
